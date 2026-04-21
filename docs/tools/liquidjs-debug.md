# liquidjs-debug CLI

A Go-based toolkit for debugging, reverse-engineering, and analyzing minified/obfuscated LiquidJS application bundles.

## Installation

```bash
cd tools/liquidjs-debug
go build -o liquidjs-debug .
```

## Commands

### deminify

Pretty-print minified JavaScript with proper indentation:

```bash
liquidjs-debug deminify bundle.min.js
liquidjs-debug deminify bundle.min.js -o readable.js
liquidjs-debug deminify bundle.min.js --indent "    "  # 4-space indent
```

### deobfuscate

Reverse variable/function name mangling using heuristic analysis:

```bash
liquidjs-debug deobfuscate bundle.min.js
liquidjs-debug deobfuscate bundle.min.js -o deobfuscated.js
liquidjs-debug deobfuscate bundle.min.js --report  # Print rename map to stderr
```

Heuristics detect:
- DOM element variables (`document.getElementById`)
- Event handlers (`function(e)`)
- Array variables (`= [`)
- Counter variables (`++`, `+=`)

### decompress

Decompress gzipped JavaScript bundles:

```bash
liquidjs-debug decompress bundle.js.gz
liquidjs-debug decompress bundle.js.gz -o bundle.js
```

Auto-detects compression format (gzip, raw).

### sourcemap

Parse and query source maps:

```bash
# Show source map summary
liquidjs-debug sourcemap info bundle.js.map

# Look up original position for generated line:col
liquidjs-debug sourcemap lookup bundle.js.map 1:42
liquidjs-debug sourcemap lookup bundle.js.map 1:42 --json
```

Supports Source Map v3 with full VLQ decoding.

### analyze

Produce bundle statistics:

```bash
liquidjs-debug analyze bundle.js
```

Output includes:
- Size (raw + formatted)
- Line, function, variable, and string counts
- Import/export lists
- Top 20 most frequent identifiers

## Global Flags

```
-v, --verbose   Verbose output
-h, --help      Help for any command
```

## Architecture

Built with Go 1.25+ and [Cobra](https://github.com/spf13/cobra). Each command delegates to a pure-function package under `pkg/`:

```
tools/liquidjs-debug/
  cmd/           Cobra command definitions
  pkg/
    deminify/    JS pretty-printing engine
    deobfuscate/ Heuristic name recovery
    decompress/  Gzip decompression
    sourcemap/   Source map v3 parser + VLQ decoder
    analyze/     Bundle statistics
```

All packages include unit tests. Run with: `go test -v ./pkg/...`
