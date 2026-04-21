package cmd

import (
	"fmt"
	"os"

	"github.com/nickolasgb/liquidjs/tools/liquidjs-debug/pkg/deminify"
	"github.com/spf13/cobra"
)

var deminifyCmd = &cobra.Command{
	Use:   "deminify <file>",
	Short: "Pretty-print minified JavaScript",
	Long:  `Reformats minified JavaScript with proper indentation, line breaks, and whitespace.`,
	Args:  cobra.ExactArgs(1),
	RunE:  runDeminify,
}

var deminifyOutput string
var deminifyIndent string

func init() {
	deminifyCmd.Flags().StringVarP(&deminifyOutput, "output", "o", "", "output file (default: stdout)")
	deminifyCmd.Flags().StringVar(&deminifyIndent, "indent", "  ", "indentation string")
	rootCmd.AddCommand(deminifyCmd)
}

func runDeminify(cmd *cobra.Command, args []string) error {
	input, err := os.Open(args[0])
	if err != nil {
		return fmt.Errorf("opening input: %w", err)
	}
	defer input.Close()

	opts := deminify.Options{IndentStr: deminifyIndent}

	var out *os.File
	if deminifyOutput != "" {
		out, err = os.Create(deminifyOutput)
		if err != nil {
			return fmt.Errorf("creating output: %w", err)
		}
		defer out.Close()
	} else {
		out = os.Stdout
	}

	return deminify.Format(out, input, opts)
}
