package cmd

import (
	"fmt"
	"path/filepath"
	"strings"

	"github.com/spf13/cobra"
)

var listCmd = &cobra.Command{
	Use:   "list",
	Short: "List all available demo projects",
	RunE:  runList,
}

func init() {
	rootCmd.AddCommand(listCmd)
}

func runList(cmd *cobra.Command, args []string) error {
	demos, err := demosDir()
	if err != nil {
		return err
	}

	projects, err := ListProjects(demos)
	if err != nil {
		return fmt.Errorf("listing projects: %w", err)
	}

	if len(projects) == 0 {
		fmt.Println("No demo projects found.")
		return nil
	}

	fmt.Printf("%-20s %-4s %s\n", "PROJECT", "CTRS", "DESCRIPTION")
	fmt.Println(strings.Repeat("-", 70))

	for _, name := range projects {
		m, err := LoadManifest(filepath.Join(demos, name))
		if err != nil {
			fmt.Printf("%-20s  ?   (error reading manifest: %v)\n", name, err)
			continue
		}

		ctrs := fmt.Sprintf("%d", m.Containers)
		fmt.Printf("%-20s %-4s %s\n", name, ctrs, m.Description)
	}

	return nil
}
