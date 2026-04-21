// Package deminify provides JavaScript pretty-printing (de-minification).
// It parses minified JS and re-formats it with proper indentation, line breaks,
// and whitespace to make it human-readable.
package deminify

import (
	"bytes"
	"io"
	"strings"
	"unicode"
)

// Options controls formatting behavior.
type Options struct {
	IndentStr string // Indentation string (default: "  ")
	TabWidth  int    // Tab width for column tracking (default: 2)
}

// DefaultOptions returns sensible defaults.
func DefaultOptions() Options {
	return Options{
		IndentStr: "  ",
		TabWidth:  2,
	}
}

// Format reads minified JavaScript from src and writes pretty-printed output to dst.
func Format(dst io.Writer, src io.Reader, opts Options) error {
	if opts.IndentStr == "" {
		opts.IndentStr = "  "
	}

	data, err := io.ReadAll(src)
	if err != nil {
		return err
	}

	result := FormatString(string(data), opts)
	_, err = io.WriteString(dst, result)
	return err
}

// FormatString pretty-prints a minified JavaScript string.
func FormatString(input string, opts Options) string {
	if opts.IndentStr == "" {
		opts.IndentStr = "  "
	}

	var buf bytes.Buffer
	indent := 0
	inString := false
	stringChar := byte(0)
	escaped := false
	inLineComment := false
	inBlockComment := false
	lastNonSpace := byte(0)

	writeIndent := func() {
		for i := 0; i < indent; i++ {
			buf.WriteString(opts.IndentStr)
		}
	}

	needsNewlineBefore := func(ch byte) bool {
		return ch == '}' || ch == ']'
	}

	needsNewlineAfter := func(ch byte) bool {
		return ch == '{' || ch == '[' || ch == ';'
	}

	i := 0
	for i < len(input) {
		ch := input[i]

		// Handle escape sequences in strings
		if escaped {
			buf.WriteByte(ch)
			escaped = false
			i++
			continue
		}

		// Inside line comment
		if inLineComment {
			buf.WriteByte(ch)
			if ch == '\n' {
				inLineComment = false
			}
			i++
			continue
		}

		// Inside block comment
		if inBlockComment {
			buf.WriteByte(ch)
			if ch == '*' && i+1 < len(input) && input[i+1] == '/' {
				buf.WriteByte('/')
				inBlockComment = false
				i += 2
				continue
			}
			i++
			continue
		}

		// Inside string literal
		if inString {
			buf.WriteByte(ch)
			if ch == '\\' {
				escaped = true
			} else if ch == stringChar {
				inString = false
			}
			i++
			continue
		}

		// String start
		if ch == '"' || ch == '\'' || ch == '`' {
			inString = true
			stringChar = ch
			buf.WriteByte(ch)
			i++
			continue
		}

		// Comment detection
		if ch == '/' && i+1 < len(input) {
			if input[i+1] == '/' {
				inLineComment = true
				buf.WriteByte(ch)
				i++
				continue
			}
			if input[i+1] == '*' {
				inBlockComment = true
				buf.WriteByte(ch)
				i++
				continue
			}
		}

		// Closing braces/brackets — decrease indent before writing
		if needsNewlineBefore(ch) {
			indent--
			if indent < 0 {
				indent = 0
			}
			buf.WriteByte('\n')
			writeIndent()
			buf.WriteByte(ch)
			lastNonSpace = ch
			i++
			continue
		}

		// Opening braces/brackets and semicolons — write then newline
		if needsNewlineAfter(ch) {
			buf.WriteByte(ch)
			if ch == '{' || ch == '[' {
				indent++
			}
			buf.WriteByte('\n')
			writeIndent()
			lastNonSpace = ch
			i++
			continue
		}

		// Comma — add newline after in object/array contexts
		if ch == ',' {
			buf.WriteByte(ch)
			buf.WriteByte('\n')
			writeIndent()
			lastNonSpace = ch
			i++
			continue
		}

		// Colon after property name — add space after
		if ch == ':' {
			buf.WriteByte(ch)
			buf.WriteByte(' ')
			lastNonSpace = ch
			i++
			continue
		}

		// Skip leading whitespace on new lines (we handle indentation ourselves)
		if (ch == ' ' || ch == '\t') && (lastNonSpace == 0 || buf.Len() == 0) {
			i++
			continue
		}

		buf.WriteByte(ch)
		if !unicode.IsSpace(rune(ch)) {
			lastNonSpace = ch
		}
		i++
	}

	// Ensure trailing newline
	result := buf.String()
	result = strings.TrimRight(result, " \t")
	if len(result) > 0 && result[len(result)-1] != '\n' {
		result += "\n"
	}
	return result
}
