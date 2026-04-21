package cmd

import (
	"fmt"
	"os"

	"github.com/nickolasgb/liquidjs/tools/liquidjs-debug/pkg/analyze"
	"github.com/spf13/cobra"
)

var analyzeCmd = &cobra.Command{
	Use:   "analyze <file>",
	Short: "Analyze bundle contents and statistics",
	Long:  `Produces a statistical report of a JavaScript bundle: size, functions, variables, imports, exports, and top identifiers.`,
	Args:  cobra.ExactArgs(1),
	RunE:  runAnalyze,
}

func init() {
	rootCmd.AddCommand(analyzeCmd)
}

func runAnalyze(cmd *cobra.Command, args []string) error {
	f, err := os.Open(args[0])
	if err != nil {
		return fmt.Errorf("opening file: %w", err)
	}
	defer f.Close()

	report, err := analyze.Analyze(f)
	if err != nil {
		return fmt.Errorf("analyzing: %w", err)
	}

	fmt.Print(analyze.FormatReport(report))
	return nil
}
