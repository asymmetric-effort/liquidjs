package cmd

import (
	"fmt"
	"os"

	"github.com/nickolasgb/liquidjs/tools/liquidjs-debug/pkg/decompress"
	"github.com/spf13/cobra"
)

var decompressCmd = &cobra.Command{
	Use:   "decompress <file>",
	Short: "Decompress gzipped or brotli-compressed bundles",
	Long:  `Detects the compression format and decompresses JavaScript bundles.`,
	Args:  cobra.ExactArgs(1),
	RunE:  runDecompress,
}

var decompressOutput string

func init() {
	decompressCmd.Flags().StringVarP(&decompressOutput, "output", "o", "", "output file (default: derived from input)")
	rootCmd.AddCommand(decompressCmd)
}

func runDecompress(cmd *cobra.Command, args []string) error {
	n, err := decompress.DecompressFile(args[0], decompressOutput)
	if err != nil {
		return err
	}

	verbose, _ := cmd.Flags().GetBool("verbose")
	if verbose {
		fmt.Fprintf(os.Stderr, "Decompressed %d bytes\n", n)
	}

	return nil
}
