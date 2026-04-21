package cmd

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "demos",
	Short: "Manage LiquidJS demonstration projects",
	Long: `demos manages containerized LiquidJS demonstration SPAs.

Each demo lives in demos/<project>/ with a docker-compose.yml and manifest.yaml.
Use this tool to list, run, stop, and create demo projects.`,
}

func Execute() error {
	return rootCmd.Execute()
}

// findRepoRoot walks up from the current or binary directory to find the repo root
// (identified by containing a demos/ directory).
func findRepoRoot() (string, error) {
	// Try current directory first
	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}

	for i := 0; i < 10; i++ {
		if _, err := os.Stat(filepath.Join(dir, "demos")); err == nil {
			return dir, nil
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}

	// Try relative to the binary
	exe, err := os.Executable()
	if err == nil {
		dir = filepath.Dir(exe)
		for i := 0; i < 10; i++ {
			if _, err := os.Stat(filepath.Join(dir, "demos")); err == nil {
				return dir, nil
			}
			parent := filepath.Dir(dir)
			if parent == dir {
				break
			}
			dir = parent
		}
	}

	return "", fmt.Errorf("could not find repo root (directory containing demos/)")
}

func demosDir() (string, error) {
	root, err := findRepoRoot()
	if err != nil {
		return "", err
	}
	return filepath.Join(root, "demos"), nil
}
