// Package analyze provides bundle analysis: size breakdown, dependency
// detection, and content statistics for JavaScript bundles.
package analyze

import (
	"fmt"
	"io"
	"regexp"
	"sort"
	"strings"
)

// Report contains the analysis results.
type Report struct {
	TotalSize       int64
	Lines           int
	Functions       int
	Variables       int
	Strings         int
	Imports         []string
	Exports         []string
	TopIdentifiers  []IdentifierCount
	EstimatedGzip   int64
}

// IdentifierCount tracks how often an identifier appears.
type IdentifierCount struct {
	Name  string
	Count int
}

var (
	funcPattern   = regexp.MustCompile(`\bfunction\b`)
	varPattern    = regexp.MustCompile(`\b(?:var|let|const)\b`)
	stringPattern = regexp.MustCompile(`(?:"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')`)
	importPattern = regexp.MustCompile(`\bimport\b[^;]+from\s+["']([^"']+)["']`)
	exportPattern = regexp.MustCompile(`\bexport\b\s+(?:default\s+)?(?:function|class|const|let|var)\s+(\w+)`)
	identPattern  = regexp.MustCompile(`\b([a-zA-Z_$][a-zA-Z0-9_$]{2,})\b`)
)

// Analyze reads a JavaScript bundle and produces a statistical report.
func Analyze(r io.Reader) (*Report, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return nil, err
	}

	return AnalyzeString(string(data)), nil
}

// AnalyzeString produces a report from a JavaScript string.
func AnalyzeString(input string) *Report {
	report := &Report{
		TotalSize: int64(len(input)),
		Lines:     strings.Count(input, "\n") + 1,
	}

	report.Functions = len(funcPattern.FindAllString(input, -1))
	report.Variables = len(varPattern.FindAllString(input, -1))
	report.Strings = len(stringPattern.FindAllString(input, -1))

	// Extract imports
	for _, match := range importPattern.FindAllStringSubmatch(input, -1) {
		if len(match) > 1 {
			report.Imports = append(report.Imports, match[1])
		}
	}

	// Extract exports
	for _, match := range exportPattern.FindAllStringSubmatch(input, -1) {
		if len(match) > 1 {
			report.Exports = append(report.Exports, match[1])
		}
	}

	// Count identifier frequency
	identCounts := make(map[string]int)
	for _, match := range identPattern.FindAllStringSubmatch(input, -1) {
		if len(match) > 1 && !isKeyword(match[1]) {
			identCounts[match[1]]++
		}
	}

	var idents []IdentifierCount
	for name, count := range identCounts {
		idents = append(idents, IdentifierCount{Name: name, Count: count})
	}
	sort.Slice(idents, func(i, j int) bool {
		return idents[i].Count > idents[j].Count
	})
	if len(idents) > 20 {
		idents = idents[:20]
	}
	report.TopIdentifiers = idents

	return report
}

// FormatReport produces a human-readable report string.
func FormatReport(r *Report) string {
	var sb strings.Builder

	fmt.Fprintf(&sb, "Bundle Analysis\n")
	fmt.Fprintf(&sb, "===============\n\n")
	fmt.Fprintf(&sb, "Size:       %s (%d bytes)\n", formatSize(r.TotalSize), r.TotalSize)
	fmt.Fprintf(&sb, "Lines:      %d\n", r.Lines)
	fmt.Fprintf(&sb, "Functions:  %d\n", r.Functions)
	fmt.Fprintf(&sb, "Variables:  %d\n", r.Variables)
	fmt.Fprintf(&sb, "Strings:    %d\n", r.Strings)

	if len(r.Imports) > 0 {
		fmt.Fprintf(&sb, "\nImports (%d):\n", len(r.Imports))
		for _, imp := range r.Imports {
			fmt.Fprintf(&sb, "  %s\n", imp)
		}
	}

	if len(r.Exports) > 0 {
		fmt.Fprintf(&sb, "\nExports (%d):\n", len(r.Exports))
		for _, exp := range r.Exports {
			fmt.Fprintf(&sb, "  %s\n", exp)
		}
	}

	if len(r.TopIdentifiers) > 0 {
		fmt.Fprintf(&sb, "\nTop Identifiers:\n")
		for _, id := range r.TopIdentifiers {
			fmt.Fprintf(&sb, "  %-30s %d\n", id.Name, id.Count)
		}
	}

	return sb.String()
}

func formatSize(bytes int64) string {
	if bytes < 1024 {
		return fmt.Sprintf("%d B", bytes)
	}
	if bytes < 1024*1024 {
		return fmt.Sprintf("%.1f KB", float64(bytes)/1024)
	}
	return fmt.Sprintf("%.1f MB", float64(bytes)/(1024*1024))
}

func isKeyword(s string) bool {
	keywords := map[string]bool{
		"function": true, "return": true, "var": true, "let": true, "const": true,
		"if": true, "else": true, "for": true, "while": true, "do": true,
		"switch": true, "case": true, "break": true, "continue": true, "default": true,
		"new": true, "delete": true, "typeof": true, "instanceof": true, "void": true,
		"this": true, "class": true, "extends": true, "super": true, "import": true,
		"export": true, "from": true, "try": true, "catch": true, "finally": true,
		"throw": true, "async": true, "await": true, "yield": true, "true": true,
		"false": true, "null": true, "undefined": true, "with": true, "debugger": true,
	}
	return keywords[s]
}
