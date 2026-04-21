package analyze

import (
	"strings"
	"testing"
)

func TestAnalyzeString_Basic(t *testing.T) {
	input := `function hello() { var x = 1; return x; }`
	report := AnalyzeString(input)

	if report.TotalSize != int64(len(input)) {
		t.Errorf("expected size %d, got %d", len(input), report.TotalSize)
	}
	if report.Functions != 1 {
		t.Errorf("expected 1 function, got %d", report.Functions)
	}
	if report.Variables != 1 {
		t.Errorf("expected 1 variable, got %d", report.Variables)
	}
}

func TestAnalyzeString_Imports(t *testing.T) {
	input := `import { foo } from './utils'; import bar from 'lodash';`
	report := AnalyzeString(input)

	if len(report.Imports) != 2 {
		t.Errorf("expected 2 imports, got %d", len(report.Imports))
	}
	found := false
	for _, imp := range report.Imports {
		if imp == "./utils" {
			found = true
		}
	}
	if !found {
		t.Error("expected to find './utils' import")
	}
}

func TestAnalyzeString_Exports(t *testing.T) {
	input := `export function hello() {} export const PI = 3.14;`
	report := AnalyzeString(input)

	if len(report.Exports) != 2 {
		t.Errorf("expected 2 exports, got %d: %v", len(report.Exports), report.Exports)
	}
}

func TestAnalyzeString_Strings(t *testing.T) {
	input := `var a = "hello"; var b = 'world'; var c = 42;`
	report := AnalyzeString(input)

	if report.Strings != 2 {
		t.Errorf("expected 2 strings, got %d", report.Strings)
	}
}

func TestAnalyzeString_TopIdentifiers(t *testing.T) {
	input := `function foo() { foo(); foo(); } function bar() { bar(); }`
	report := AnalyzeString(input)

	if len(report.TopIdentifiers) == 0 {
		t.Error("expected top identifiers")
	}
	// foo should appear more than bar
	if report.TopIdentifiers[0].Name != "foo" {
		t.Errorf("expected 'foo' as top identifier, got %q", report.TopIdentifiers[0].Name)
	}
}

func TestAnalyzeString_Empty(t *testing.T) {
	report := AnalyzeString("")
	if report.TotalSize != 0 {
		t.Errorf("expected 0 size, got %d", report.TotalSize)
	}
}

func TestAnalyze_Reader(t *testing.T) {
	input := `function test() { return 1; }`
	report, err := Analyze(strings.NewReader(input))
	if err != nil {
		t.Fatalf("Analyze error: %v", err)
	}
	if report.Functions != 1 {
		t.Errorf("expected 1 function, got %d", report.Functions)
	}
}

func TestFormatReport(t *testing.T) {
	report := &Report{
		TotalSize:  1024,
		Lines:      50,
		Functions:  5,
		Variables:  10,
		Strings:    3,
		Imports:    []string{"./utils"},
		Exports:    []string{"hello"},
		TopIdentifiers: []IdentifierCount{
			{Name: "foo", Count: 10},
		},
	}

	output := FormatReport(report)

	if !strings.Contains(output, "1.0 KB") {
		t.Errorf("expected formatted size in report:\n%s", output)
	}
	if !strings.Contains(output, "Functions:  5") {
		t.Errorf("expected function count in report:\n%s", output)
	}
	if !strings.Contains(output, "./utils") {
		t.Errorf("expected import in report:\n%s", output)
	}
}

func TestFormatSize(t *testing.T) {
	tests := []struct {
		bytes int64
		want  string
	}{
		{100, "100 B"},
		{1500, "1.5 KB"},
		{1500000, "1.4 MB"},
	}

	for _, tt := range tests {
		got := formatSize(tt.bytes)
		if got != tt.want {
			t.Errorf("formatSize(%d) = %q, want %q", tt.bytes, got, tt.want)
		}
	}
}
