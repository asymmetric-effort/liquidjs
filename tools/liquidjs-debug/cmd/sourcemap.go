package cmd

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/nickolasgb/liquidjs/tools/liquidjs-debug/pkg/sourcemap"
	"github.com/spf13/cobra"
)

var sourcemapCmd = &cobra.Command{
	Use:   "sourcemap <file.map>",
	Short: "Parse and apply source maps",
	Long:  `Parse a source map file and optionally look up original positions for generated positions.`,
	Args:  cobra.ExactArgs(1),
}

var sourcemapInfoCmd = &cobra.Command{
	Use:   "info <file.map>",
	Short: "Display source map summary",
	Args:  cobra.ExactArgs(1),
	RunE:  runSourcemapInfo,
}

var sourcemapLookupCmd = &cobra.Command{
	Use:   "lookup <file.map> <line:col>",
	Short: "Look up original position for a generated position",
	Args:  cobra.ExactArgs(2),
	RunE:  runSourcemapLookup,
}

var sourcemapJSON bool

func init() {
	sourcemapLookupCmd.Flags().BoolVar(&sourcemapJSON, "json", false, "output as JSON")
	sourcemapCmd.AddCommand(sourcemapInfoCmd)
	sourcemapCmd.AddCommand(sourcemapLookupCmd)
	rootCmd.AddCommand(sourcemapCmd)
}

func runSourcemapInfo(cmd *cobra.Command, args []string) error {
	sm, err := sourcemap.ParseFile(args[0])
	if err != nil {
		return err
	}

	fmt.Print(sm.Summary())
	return nil
}

func runSourcemapLookup(cmd *cobra.Command, args []string) error {
	sm, err := sourcemap.ParseFile(args[0])
	if err != nil {
		return err
	}

	parts := strings.SplitN(args[1], ":", 2)
	if len(parts) != 2 {
		return fmt.Errorf("position must be in line:col format")
	}

	line, err := strconv.Atoi(parts[0])
	if err != nil {
		return fmt.Errorf("invalid line number: %w", err)
	}
	col, err := strconv.Atoi(parts[1])
	if err != nil {
		return fmt.Errorf("invalid column number: %w", err)
	}

	mapping, err := sm.Lookup(line, col)
	if err != nil {
		return err
	}

	if sourcemapJSON {
		enc := json.NewEncoder(os.Stdout)
		enc.SetIndent("", "  ")
		return enc.Encode(mapping)
	}

	fmt.Printf("%s:%d:%d", mapping.OriginalFile, mapping.OriginalLine, mapping.OriginalCol)
	if mapping.Name != "" {
		fmt.Printf(" (%s)", mapping.Name)
	}
	fmt.Println()

	return nil
}
