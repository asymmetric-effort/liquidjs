// Package deobfuscate reverses variable and function name mangling in
// minified JavaScript bundles. It uses heuristic analysis to assign
// meaningful names based on usage context.
package deobfuscate

import (
	"fmt"
	"io"
	"regexp"
	"sort"
	"strings"
)

// Options controls deobfuscation behavior.
type Options struct {
	// MappingFile is an optional path to a name-mapping JSON file (original -> mangled).
	MappingFile string
	// Heuristic enables heuristic renaming when no mapping is available.
	Heuristic bool
}

// DefaultOptions returns sensible defaults.
func DefaultOptions() Options {
	return Options{
		Heuristic: true,
	}
}

// MangledName represents a detected mangled identifier with context.
type MangledName struct {
	Original string
	Context  string // Where it was found (e.g., "function parameter", "variable declaration")
	Line     int
}

// Result holds the deobfuscation output.
type Result struct {
	Output   string
	Renames  map[string]string // mangled -> readable
	Stats    Stats
}

// Stats provides summary statistics about the deobfuscation.
type Stats struct {
	TotalIdentifiers    int
	MangledIdentifiers  int
	RenamedIdentifiers  int
}

var (
	// Matches single-letter or very short identifiers that are likely mangled
	mangledVarPattern  = regexp.MustCompile(`\b([a-z])\b`)
	mangledFuncPattern = regexp.MustCompile(`\bfunction\s+([a-zA-Z]\w{0,2})\b`)
	varDeclPattern     = regexp.MustCompile(`\b(?:var|let|const)\s+([a-zA-Z]\w{0,2})\b`)
)

// Process reads minified JS and attempts to reverse name mangling.
func Process(dst io.Writer, src io.Reader, opts Options) (*Result, error) {
	data, err := io.ReadAll(src)
	if err != nil {
		return nil, err
	}

	result := ProcessString(string(data), opts)

	_, err = io.WriteString(dst, result.Output)
	if err != nil {
		return nil, err
	}

	return result, nil
}

// ProcessString deobfuscates a JavaScript string.
func ProcessString(input string, opts Options) *Result {
	result := &Result{
		Renames: make(map[string]string),
	}

	// Detect mangled identifiers
	mangledVars := findMangledIdentifiers(input)
	result.Stats.TotalIdentifiers = countIdentifiers(input)
	result.Stats.MangledIdentifiers = len(mangledVars)

	if !opts.Heuristic || len(mangledVars) == 0 {
		result.Output = input
		return result
	}

	// Build rename map using heuristic analysis
	renames := buildRenameMap(input, mangledVars)
	result.Renames = renames
	result.Stats.RenamedIdentifiers = len(renames)

	// Apply renames
	output := applyRenames(input, renames)
	result.Output = output

	return result
}

func findMangledIdentifiers(input string) []string {
	seen := make(map[string]bool)
	var result []string

	// Find single/double letter variable declarations
	for _, matches := range varDeclPattern.FindAllStringSubmatch(input, -1) {
		if len(matches) > 1 {
			name := matches[1]
			if len(name) <= 2 && !seen[name] && !isCommonShortName(name) {
				seen[name] = true
				result = append(result, name)
			}
		}
	}

	sort.Strings(result)
	return result
}

func countIdentifiers(input string) int {
	identPattern := regexp.MustCompile(`\b[a-zA-Z_$][a-zA-Z0-9_$]*\b`)
	matches := identPattern.FindAllString(input, -1)
	seen := make(map[string]bool)
	for _, m := range matches {
		seen[m] = true
	}
	return len(seen)
}

func isCommonShortName(name string) bool {
	common := map[string]bool{
		"i": true, "j": true, "k": true, "n": true, "m": true,
		"x": true, "y": true, "z": true, "e": true, "v": true,
		"fn": true, "cb": true, "el": true, "id": true, "ok": true,
	}
	return common[name]
}

func buildRenameMap(input string, mangledVars []string) map[string]string {
	renames := make(map[string]string)
	counter := 0
	prefixes := []string{"val", "ref", "tmp", "arg", "ctx", "res", "obj", "arr", "num", "str"}

	for _, name := range mangledVars {
		// Try to infer purpose from context
		readable := inferName(input, name)
		if readable == "" {
			// Fallback to sequential naming
			prefix := prefixes[counter%len(prefixes)]
			readable = fmt.Sprintf("%s_%d", prefix, counter)
			counter++
		}
		renames[name] = readable
	}

	return renames
}

func inferName(input string, name string) string {
	// Look for patterns that hint at the variable's purpose
	escaped := regexp.QuoteMeta(name)

	// Check if it's used as a DOM element
	domPattern := regexp.MustCompile(escaped + `\s*=\s*document\.(?:getElementById|querySelector|createElement)\s*\(`)
	if domPattern.MatchString(input) {
		return "element"
	}

	// Check if it's used as an event handler
	eventPattern := regexp.MustCompile(escaped + `\s*=\s*function\s*\(\s*(?:e|event|evt)\s*\)`)
	if eventPattern.MatchString(input) {
		return "handler"
	}

	// Check if it's used as an array
	arrayPattern := regexp.MustCompile(escaped + `\s*=\s*\[`)
	if arrayPattern.MatchString(input) {
		return "items"
	}

	// Check if it's used as a counter
	counterPattern := regexp.MustCompile(escaped + `\s*(?:\+\+|--|\+=|-=)`)
	if counterPattern.MatchString(input) {
		return "counter"
	}

	return ""
}

func applyRenames(input string, renames map[string]string) string {
	output := input
	// Sort by length (longest first) to avoid partial replacements
	var names []string
	for name := range renames {
		names = append(names, name)
	}
	sort.Slice(names, func(i, j int) bool {
		return len(names[i]) > len(names[j])
	})

	for _, name := range names {
		readable := renames[name]
		// Use word boundary replacement to avoid breaking longer identifiers
		pattern := regexp.MustCompile(`\b` + regexp.QuoteMeta(name) + `\b`)
		output = pattern.ReplaceAllString(output, readable)
	}
	return output
}

// FormatRenameReport generates a human-readable report of renames.
func FormatRenameReport(renames map[string]string) string {
	var sb strings.Builder
	sb.WriteString("Rename Map:\n")

	var names []string
	for name := range renames {
		names = append(names, name)
	}
	sort.Strings(names)

	for _, name := range names {
		fmt.Fprintf(&sb, "  %s -> %s\n", name, renames[name])
	}
	return sb.String()
}
