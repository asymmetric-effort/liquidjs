package cmd

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/spf13/cobra"
)

var stopCmd = &cobra.Command{
	Use:   "stop <project>",
	Short: "Stop a running demo project",
	Args:  cobra.ExactArgs(1),
	RunE:  runStop,
}

func init() {
	rootCmd.AddCommand(stopCmd)
}

func runStop(cmd *cobra.Command, args []string) error {
	demos, err := demosDir()
	if err != nil {
		return err
	}

	project := args[0]
	composePath := filepath.Join(demos, project, "docker-compose.yml")

	if _, err := os.Stat(composePath); os.IsNotExist(err) {
		return fmt.Errorf("demo %q not found", project)
	}

	fmt.Printf("Stopping %s...\n", project)

	c := exec.Command("docker", "compose", "-f", composePath, "down")
	c.Stdout = os.Stdout
	c.Stderr = os.Stderr

	if err := c.Run(); err != nil {
		return fmt.Errorf("stopping %s: %w", project, err)
	}

	fmt.Printf("%s stopped.\n", project)
	return nil
}
