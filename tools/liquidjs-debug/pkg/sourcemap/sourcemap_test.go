package sourcemap

import (
	"strings"
	"testing"
)

func makeTestSourceMap() string {
	return `{
		"version": 3,
		"file": "bundle.js",
		"sourceRoot": "",
		"sources": ["src/app.ts", "src/utils.ts"],
		"names": ["hello", "world"],
		"mappings": "AAAA,SAASA;AACT,SAASAC"
	}`
}

func TestParse_ValidSourceMap(t *testing.T) {
	sm, err := Parse(strings.NewReader(makeTestSourceMap()))
	if err != nil {
		t.Fatalf("parse error: %v", err)
	}
	if sm.Version != 3 {
		t.Errorf("expected version 3, got %d", sm.Version)
	}
	if sm.File != "bundle.js" {
		t.Errorf("expected file 'bundle.js', got %q", sm.File)
	}
	if len(sm.Sources) != 2 {
		t.Errorf("expected 2 sources, got %d", len(sm.Sources))
	}
	if len(sm.Names) != 2 {
		t.Errorf("expected 2 names, got %d", len(sm.Names))
	}
}

func TestParse_InvalidVersion(t *testing.T) {
	input := `{"version": 2, "mappings": ""}`
	_, err := Parse(strings.NewReader(input))
	if err == nil {
		t.Error("expected error for version 2")
	}
}

func TestParse_InvalidJSON(t *testing.T) {
	_, err := Parse(strings.NewReader("not json"))
	if err == nil {
		t.Error("expected error for invalid JSON")
	}
}

func TestLookup_ValidPosition(t *testing.T) {
	sm, err := Parse(strings.NewReader(makeTestSourceMap()))
	if err != nil {
		t.Fatalf("parse error: %v", err)
	}

	mapping, err := sm.Lookup(1, 0)
	if err != nil {
		t.Fatalf("lookup error: %v", err)
	}
	if mapping.OriginalFile != "src/app.ts" {
		t.Errorf("expected src/app.ts, got %q", mapping.OriginalFile)
	}
	if mapping.OriginalLine != 1 {
		t.Errorf("expected original line 1, got %d", mapping.OriginalLine)
	}
}

func TestLookup_OutOfRange(t *testing.T) {
	sm, err := Parse(strings.NewReader(makeTestSourceMap()))
	if err != nil {
		t.Fatalf("parse error: %v", err)
	}

	_, err = sm.Lookup(100, 0)
	if err == nil {
		t.Error("expected error for out of range line")
	}
}

func TestLookup_LineZero(t *testing.T) {
	sm, err := Parse(strings.NewReader(makeTestSourceMap()))
	if err != nil {
		t.Fatalf("parse error: %v", err)
	}

	_, err = sm.Lookup(0, 0)
	if err == nil {
		t.Error("expected error for line 0")
	}
}

func TestSummary(t *testing.T) {
	sm, err := Parse(strings.NewReader(makeTestSourceMap()))
	if err != nil {
		t.Fatalf("parse error: %v", err)
	}

	summary := sm.Summary()
	if !strings.Contains(summary, "Source Map v3") {
		t.Errorf("summary missing version:\n%s", summary)
	}
	if !strings.Contains(summary, "src/app.ts") {
		t.Errorf("summary missing source:\n%s", summary)
	}
}

func TestDecodeVLQ(t *testing.T) {
	tests := []struct {
		input string
		want  int
	}{
		{"A", 0},
		{"C", 1},
		{"D", -1},
		{"E", 2},
		{"K", 5},
	}

	for _, tt := range tests {
		val, _, err := decodeVLQ(tt.input)
		if err != nil {
			t.Errorf("decodeVLQ(%q) error: %v", tt.input, err)
			continue
		}
		if val != tt.want {
			t.Errorf("decodeVLQ(%q) = %d, want %d", tt.input, val, tt.want)
		}
	}
}

func TestDecodeVLQ_InvalidChar(t *testing.T) {
	_, _, err := decodeVLQ("!")
	if err == nil {
		t.Error("expected error for invalid character")
	}
}
