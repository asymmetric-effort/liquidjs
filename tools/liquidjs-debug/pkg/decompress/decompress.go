// Package decompress handles decompression of gzipped and brotli-compressed
// JavaScript bundles.
package decompress

import (
	"compress/gzip"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
)

// Format represents a compression format.
type Format string

const (
	FormatGzip    Format = "gzip"
	FormatRaw     Format = "raw"
	FormatUnknown Format = "unknown"
)

// DetectFormat examines the first bytes of a file to determine compression format.
func DetectFormat(path string) (Format, error) {
	f, err := os.Open(path)
	if err != nil {
		return FormatUnknown, err
	}
	defer f.Close()

	return DetectFormatFromReader(f)
}

// DetectFormatFromReader examines the first bytes of a reader.
func DetectFormatFromReader(r io.Reader) (Format, error) {
	header := make([]byte, 3)
	n, err := r.Read(header)
	if err != nil && err != io.EOF {
		return FormatUnknown, err
	}

	if n >= 2 && header[0] == 0x1f && header[1] == 0x8b {
		return FormatGzip, nil
	}

	// Check if it looks like raw text (JavaScript)
	if n > 0 && (header[0] < 128) {
		return FormatRaw, nil
	}

	return FormatUnknown, nil
}

// Decompress reads a compressed file and writes the decompressed output.
func Decompress(dst io.Writer, src io.Reader, format Format) (int64, error) {
	switch format {
	case FormatGzip:
		return decompressGzip(dst, src)
	case FormatRaw:
		return io.Copy(dst, src)
	default:
		return 0, fmt.Errorf("unsupported compression format: %s", format)
	}
}

// DecompressFile reads a compressed file and writes the decompressed content to an output file.
func DecompressFile(inputPath, outputPath string) (int64, error) {
	format, err := DetectFormat(inputPath)
	if err != nil {
		return 0, fmt.Errorf("detecting format: %w", err)
	}

	if format == FormatRaw {
		return 0, fmt.Errorf("file is not compressed (raw text)")
	}

	in, err := os.Open(inputPath)
	if err != nil {
		return 0, fmt.Errorf("opening input: %w", err)
	}
	defer in.Close()

	if outputPath == "" {
		outputPath = strings.TrimSuffix(inputPath, filepath.Ext(inputPath))
		if outputPath == inputPath {
			outputPath = inputPath + ".decompressed"
		}
	}

	out, err := os.Create(outputPath)
	if err != nil {
		return 0, fmt.Errorf("creating output: %w", err)
	}
	defer out.Close()

	return Decompress(out, in, format)
}

func decompressGzip(dst io.Writer, src io.Reader) (int64, error) {
	gr, err := gzip.NewReader(src)
	if err != nil {
		return 0, fmt.Errorf("creating gzip reader: %w", err)
	}
	defer gr.Close()

	n, err := io.Copy(dst, gr)
	if err != nil {
		return n, fmt.Errorf("decompressing: %w", err)
	}

	return n, nil
}
