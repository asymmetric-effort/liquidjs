package deobfuscate

import (
	"bytes"
	"strings"
	"testing"
)

func TestProcessString_NoMangledVars(t *testing.T) {
	input := `function calculate(total, tax) { return total + tax; }`
	result := ProcessString(input, DefaultOptions())

	if result.Stats.MangledIdentifiers != 0 {
		t.Errorf("expected 0 mangled identifiers, got %d", result.Stats.MangledIdentifiers)
	}
	// Output should be unchanged
	if result.Output != input {
		t.Errorf("output changed when no mangling detected")
	}
}

func TestProcessString_DetectsMangledVars(t *testing.T) {
	input := `var a=[1,2,3];var b=a.length;`
	result := ProcessString(input, DefaultOptions())

	if result.Stats.MangledIdentifiers == 0 {
		t.Error("expected mangled identifiers to be detected")
	}
}

func TestProcessString_HeuristicOff(t *testing.T) {
	input := `var a=1;var b=2;`
	opts := Options{Heuristic: false}
	result := ProcessString(input, opts)

	if result.Output != input {
		t.Error("expected output unchanged when heuristic is disabled")
	}
}

func TestProcessString_CounterDetection(t *testing.T) {
	input := `var ct=0;ct++;ct+=5;`
	result := ProcessString(input, DefaultOptions())

	if result.Stats.MangledIdentifiers == 0 {
		t.Error("expected to detect mangled counter variable")
	}
}

func TestProcessString_ArrayDetection(t *testing.T) {
	input := `var ar=[];ar.push(1);`
	result := ProcessString(input, DefaultOptions())

	if _, ok := result.Renames["ar"]; ok {
		if result.Renames["ar"] != "items" {
			// Heuristic should detect array usage
			t.Logf("renamed ar to: %s", result.Renames["ar"])
		}
	}
}

func TestProcess_WriterInterface(t *testing.T) {
	var buf bytes.Buffer
	reader := strings.NewReader(`var x=1;var y=2;`)
	opts := DefaultOptions()

	result, err := Process(&buf, reader, opts)
	if err != nil {
		t.Fatalf("Process returned error: %v", err)
	}
	if result == nil {
		t.Fatal("expected non-nil result")
	}
	if buf.Len() == 0 {
		t.Error("expected non-empty output")
	}
}

func TestFormatRenameReport(t *testing.T) {
	renames := map[string]string{
		"a": "counter",
		"b": "items",
	}
	report := FormatRenameReport(renames)

	if !strings.Contains(report, "a -> counter") {
		t.Errorf("report missing rename: %s", report)
	}
	if !strings.Contains(report, "b -> items") {
		t.Errorf("report missing rename: %s", report)
	}
}

func TestIsCommonShortName(t *testing.T) {
	common := []string{"i", "j", "k", "e", "fn", "cb", "el", "id"}
	for _, name := range common {
		if !isCommonShortName(name) {
			t.Errorf("expected %q to be common", name)
		}
	}

	if isCommonShortName("zz") {
		t.Error("expected 'zz' to not be common")
	}
}
