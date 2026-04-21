package cmd

import (
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "liquidjs-debug",
	Short: "Debug and reverse-engineer LiquidJS application bundles",
	Long: `liquidjs-debug provides a suite of tools for working with minified,
obfuscated, and compressed LiquidJS application bundles.

Commands:
  deminify      Pretty-print minified JavaScript
  deobfuscate   Reverse variable/function name mangling
  decompress    Decompress gzipped or brotli-compressed bundles
  sourcemap     Parse and apply source maps
  analyze       Analyze bundle contents and statistics`,
}

func Execute() error {
	return rootCmd.Execute()
}

func init() {
	rootCmd.PersistentFlags().BoolP("verbose", "v", false, "verbose output")
}
