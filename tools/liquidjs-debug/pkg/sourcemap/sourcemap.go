// Package sourcemap parses and applies JavaScript source maps to map
// minified positions back to original source locations.
package sourcemap

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"
)

// SourceMap represents a parsed source map (v3).
type SourceMap struct {
	Version    int      `json:"version"`
	File       string   `json:"file"`
	SourceRoot string   `json:"sourceRoot"`
	Sources    []string `json:"sources"`
	Names      []string `json:"names"`
	Mappings   string   `json:"mappings"`

	// Parsed segments indexed by generated line
	segments [][]Segment
}

// Segment represents a single mapping segment.
type Segment struct {
	GeneratedCol  int
	SourceIndex   int
	OriginalLine  int
	OriginalCol   int
	NameIndex     int
	HasSource     bool
	HasName       bool
}

// Mapping represents a resolved source mapping.
type Mapping struct {
	GeneratedLine int    `json:"generatedLine"`
	GeneratedCol  int    `json:"generatedCol"`
	OriginalFile  string `json:"originalFile"`
	OriginalLine  int    `json:"originalLine"`
	OriginalCol   int    `json:"originalCol"`
	Name          string `json:"name,omitempty"`
}

// Parse reads and parses a source map from a reader.
func Parse(r io.Reader) (*SourceMap, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return nil, fmt.Errorf("reading source map: %w", err)
	}

	var sm SourceMap
	if err := json.Unmarshal(data, &sm); err != nil {
		return nil, fmt.Errorf("parsing source map JSON: %w", err)
	}

	if sm.Version != 3 {
		return nil, fmt.Errorf("unsupported source map version: %d (expected 3)", sm.Version)
	}

	sm.segments, err = decodeMappings(sm.Mappings)
	if err != nil {
		return nil, fmt.Errorf("decoding mappings: %w", err)
	}

	return &sm, nil
}

// ParseFile reads and parses a source map from a file.
func ParseFile(path string) (*SourceMap, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	return Parse(f)
}

// Lookup finds the original source position for a generated position.
func (sm *SourceMap) Lookup(generatedLine, generatedCol int) (*Mapping, error) {
	if generatedLine < 1 || generatedLine > len(sm.segments) {
		return nil, fmt.Errorf("generated line %d out of range (1-%d)", generatedLine, len(sm.segments))
	}

	segs := sm.segments[generatedLine-1]
	if len(segs) == 0 {
		return nil, fmt.Errorf("no mappings for generated line %d", generatedLine)
	}

	// Find the segment with the largest generatedCol <= requested col
	var best *Segment
	for i := range segs {
		if segs[i].GeneratedCol <= generatedCol {
			best = &segs[i]
		}
	}

	if best == nil || !best.HasSource {
		return nil, fmt.Errorf("no source mapping at line %d, col %d", generatedLine, generatedCol)
	}

	m := &Mapping{
		GeneratedLine: generatedLine,
		GeneratedCol:  generatedCol,
		OriginalLine:  best.OriginalLine + 1, // Convert to 1-indexed
		OriginalCol:   best.OriginalCol,
	}

	if best.SourceIndex >= 0 && best.SourceIndex < len(sm.Sources) {
		source := sm.Sources[best.SourceIndex]
		if sm.SourceRoot != "" {
			source = sm.SourceRoot + source
		}
		m.OriginalFile = source
	}

	if best.HasName && best.NameIndex >= 0 && best.NameIndex < len(sm.Names) {
		m.Name = sm.Names[best.NameIndex]
	}

	return m, nil
}

// Summary returns a human-readable summary of the source map.
func (sm *SourceMap) Summary() string {
	var sb strings.Builder
	fmt.Fprintf(&sb, "Source Map v%d\n", sm.Version)
	fmt.Fprintf(&sb, "File: %s\n", sm.File)
	fmt.Fprintf(&sb, "Sources (%d):\n", len(sm.Sources))
	for i, s := range sm.Sources {
		fmt.Fprintf(&sb, "  [%d] %s\n", i, s)
	}
	fmt.Fprintf(&sb, "Names (%d):\n", len(sm.Names))
	for i, n := range sm.Names {
		if i >= 20 {
			fmt.Fprintf(&sb, "  ... and %d more\n", len(sm.Names)-20)
			break
		}
		fmt.Fprintf(&sb, "  [%d] %s\n", i, n)
	}

	totalSegments := 0
	for _, segs := range sm.segments {
		totalSegments += len(segs)
	}
	fmt.Fprintf(&sb, "Mapping lines: %d\n", len(sm.segments))
	fmt.Fprintf(&sb, "Total segments: %d\n", totalSegments)

	return sb.String()
}

// decodeMappings parses VLQ-encoded source map mappings.
func decodeMappings(mappings string) ([][]Segment, error) {
	var lines [][]Segment
	var currentLine []Segment

	genCol := 0
	srcIdx := 0
	srcLine := 0
	srcCol := 0
	nameIdx := 0

	i := 0
	for i <= len(mappings) {
		if i == len(mappings) || mappings[i] == ';' {
			lines = append(lines, currentLine)
			currentLine = nil
			genCol = 0
			i++
			continue
		}

		if mappings[i] == ',' {
			i++
			continue
		}

		// Decode VLQ fields
		seg := Segment{}

		// Field 1: generated column (always present)
		val, advance, err := decodeVLQ(mappings[i:])
		if err != nil {
			return nil, err
		}
		genCol += val
		seg.GeneratedCol = genCol
		i += advance

		// Check for more fields
		if i < len(mappings) && mappings[i] != ',' && mappings[i] != ';' {
			// Field 2: source index
			val, advance, err = decodeVLQ(mappings[i:])
			if err != nil {
				return nil, err
			}
			srcIdx += val
			seg.SourceIndex = srcIdx
			seg.HasSource = true
			i += advance

			// Field 3: original line
			val, advance, err = decodeVLQ(mappings[i:])
			if err != nil {
				return nil, err
			}
			srcLine += val
			seg.OriginalLine = srcLine
			i += advance

			// Field 4: original column
			val, advance, err = decodeVLQ(mappings[i:])
			if err != nil {
				return nil, err
			}
			srcCol += val
			seg.OriginalCol = srcCol
			i += advance

			// Field 5: name index (optional)
			if i < len(mappings) && mappings[i] != ',' && mappings[i] != ';' {
				val, advance, err = decodeVLQ(mappings[i:])
				if err != nil {
					return nil, err
				}
				nameIdx += val
				seg.NameIndex = nameIdx
				seg.HasName = true
				i += advance
			}
		}

		currentLine = append(currentLine, seg)
	}

	return lines, nil
}

const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

func decodeVLQ(s string) (int, int, error) {
	value := 0
	shift := 0
	i := 0

	for i < len(s) {
		idx := strings.IndexByte(base64Chars, s[i])
		if idx < 0 {
			return 0, 0, fmt.Errorf("invalid base64 character: %c", s[i])
		}
		i++

		value |= (idx & 0x1f) << shift
		shift += 5

		if idx&0x20 == 0 {
			// Check sign bit
			if value&1 != 0 {
				value = -(value >> 1)
			} else {
				value = value >> 1
			}
			return value, i, nil
		}
	}

	return 0, 0, fmt.Errorf("unterminated VLQ sequence")
}
