package cmd

import (
	"fmt"
	"os"

	"github.com/nickolasgb/liquidjs/tools/liquidjs-debug/pkg/deobfuscate"
	"github.com/spf13/cobra"
)

var deobfuscateCmd = &cobra.Command{
	Use:   "deobfuscate <file>",
	Short: "Reverse variable/function name mangling",
	Long:  `Analyzes minified JavaScript and attempts to reverse name mangling using heuristic analysis.`,
	Args:  cobra.ExactArgs(1),
	RunE:  runDeobfuscate,
}

var deobfuscateOutput string
var deobfuscateReport bool

func init() {
	deobfuscateCmd.Flags().StringVarP(&deobfuscateOutput, "output", "o", "", "output file (default: stdout)")
	deobfuscateCmd.Flags().BoolVar(&deobfuscateReport, "report", false, "print rename report to stderr")
	rootCmd.AddCommand(deobfuscateCmd)
}

func runDeobfuscate(cmd *cobra.Command, args []string) error {
	input, err := os.Open(args[0])
	if err != nil {
		return fmt.Errorf("opening input: %w", err)
	}
	defer input.Close()

	opts := deobfuscate.DefaultOptions()

	var out *os.File
	if deobfuscateOutput != "" {
		out, err = os.Create(deobfuscateOutput)
		if err != nil {
			return fmt.Errorf("creating output: %w", err)
		}
		defer out.Close()
	} else {
		out = os.Stdout
	}

	result, err := deobfuscate.Process(out, input, opts)
	if err != nil {
		return err
	}

	if deobfuscateReport {
		fmt.Fprintln(os.Stderr, deobfuscate.FormatRenameReport(result.Renames))
		fmt.Fprintf(os.Stderr, "Total: %d identifiers, %d mangled, %d renamed\n",
			result.Stats.TotalIdentifiers, result.Stats.MangledIdentifiers, result.Stats.RenamedIdentifiers)
	}

	return nil
}
