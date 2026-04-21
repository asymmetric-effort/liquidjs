package decompress

import (
	"bytes"
	"compress/gzip"
	"strings"
	"testing"
)

func TestDetectFormatFromReader_Gzip(t *testing.T) {
	var buf bytes.Buffer
	gw := gzip.NewWriter(&buf)
	gw.Write([]byte("hello"))
	gw.Close()

	format, err := DetectFormatFromReader(bytes.NewReader(buf.Bytes()))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if format != FormatGzip {
		t.Errorf("expected gzip, got %s", format)
	}
}

func TestDetectFormatFromReader_Raw(t *testing.T) {
	format, err := DetectFormatFromReader(strings.NewReader("function hello() {}"))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if format != FormatRaw {
		t.Errorf("expected raw, got %s", format)
	}
}

func TestDecompress_Gzip(t *testing.T) {
	// Compress some data
	var compressed bytes.Buffer
	gw := gzip.NewWriter(&compressed)
	original := "function hello() { return 'world'; }"
	gw.Write([]byte(original))
	gw.Close()

	// Decompress
	var decompressed bytes.Buffer
	n, err := Decompress(&decompressed, bytes.NewReader(compressed.Bytes()), FormatGzip)
	if err != nil {
		t.Fatalf("decompress error: %v", err)
	}
	if n != int64(len(original)) {
		t.Errorf("expected %d bytes, got %d", len(original), n)
	}
	if decompressed.String() != original {
		t.Errorf("content mismatch: got %q", decompressed.String())
	}
}

func TestDecompress_Raw(t *testing.T) {
	input := "raw content"
	var buf bytes.Buffer
	n, err := Decompress(&buf, strings.NewReader(input), FormatRaw)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if n != int64(len(input)) {
		t.Errorf("expected %d bytes, got %d", len(input), n)
	}
}

func TestDecompress_UnknownFormat(t *testing.T) {
	var buf bytes.Buffer
	_, err := Decompress(&buf, strings.NewReader("test"), FormatUnknown)
	if err == nil {
		t.Error("expected error for unknown format")
	}
}

func TestDetectFormatFromReader_Empty(t *testing.T) {
	format, err := DetectFormatFromReader(strings.NewReader(""))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if format != FormatUnknown {
		t.Errorf("expected unknown for empty input, got %s", format)
	}
}
