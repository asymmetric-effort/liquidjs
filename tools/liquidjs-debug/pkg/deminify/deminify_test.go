package deminify

import (
	"bytes"
	"strings"
	"testing"
)

func TestFormatString_BasicBlock(t *testing.T) {
	input := `function a(){var b=1;return b}`
	output := FormatString(input, DefaultOptions())

	if !strings.Contains(output, "function a()") {
		t.Errorf("expected function declaration, got:\n%s", output)
	}
	if !strings.Contains(output, "\n") {
		t.Error("expected newlines in output")
	}
}

func TestFormatString_NestedBraces(t *testing.T) {
	input := `{a:{b:{c:1}}}`
	output := FormatString(input, DefaultOptions())

	lines := strings.Split(strings.TrimSpace(output), "\n")
	if len(lines) < 3 {
		t.Errorf("expected multiple lines for nested braces, got %d lines:\n%s", len(lines), output)
	}
}

func TestFormatString_PreservesStrings(t *testing.T) {
	input := `var a="hello{world}";var b='test;test'`
	output := FormatString(input, DefaultOptions())

	if !strings.Contains(output, `"hello{world}"`) {
		t.Errorf("string literal was broken:\n%s", output)
	}
	if !strings.Contains(output, `'test;test'`) {
		t.Errorf("single-quoted string was broken:\n%s", output)
	}
}

func TestFormatString_HandlesSemicolons(t *testing.T) {
	input := `a=1;b=2;c=3`
	output := FormatString(input, DefaultOptions())

	lines := strings.Split(strings.TrimSpace(output), "\n")
	if len(lines) < 3 {
		t.Errorf("expected semicolons to create newlines, got %d lines", len(lines))
	}
}

func TestFormatString_HandlesComments(t *testing.T) {
	input := `a=1;//comment\nb=2;/* block */c=3`
	output := FormatString(input, DefaultOptions())

	if !strings.Contains(output, "//comment") {
		t.Errorf("line comment was lost:\n%s", output)
	}
}

func TestFormatString_EmptyInput(t *testing.T) {
	output := FormatString("", DefaultOptions())
	if output != "" {
		t.Errorf("expected empty output for empty input, got: %q", output)
	}
}

func TestFormatString_CustomIndent(t *testing.T) {
	input := `{a:1}`
	output := FormatString(input, Options{IndentStr: "\t"})

	if !strings.Contains(output, "\t") {
		t.Errorf("expected tab indentation:\n%s", output)
	}
}

func TestFormat_WriterInterface(t *testing.T) {
	var buf bytes.Buffer
	reader := strings.NewReader(`{a:1;b:2}`)

	err := Format(&buf, reader, DefaultOptions())
	if err != nil {
		t.Fatalf("Format returned error: %v", err)
	}
	if buf.Len() == 0 {
		t.Error("expected non-empty output")
	}
}

func TestFormatString_EscapedQuotes(t *testing.T) {
	input := `var a="he said \"hello\"";`
	output := FormatString(input, DefaultOptions())

	if !strings.Contains(output, `"he said \"hello\""`) {
		t.Errorf("escaped quotes were broken:\n%s", output)
	}
}

func TestFormatString_ArrayBrackets(t *testing.T) {
	input := `var a=[1,2,3]`
	output := FormatString(input, DefaultOptions())

	if !strings.Contains(output, "[") || !strings.Contains(output, "]") {
		t.Errorf("array brackets missing:\n%s", output)
	}
}
