package cmd

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/spf13/cobra"
)

var runDetached bool

var runCmd = &cobra.Command{
	Use:   "run <project>",
	Short: "Build and start a demo project",
	Args:  cobra.ExactArgs(1),
	RunE:  runRun,
}

func init() {
	runCmd.Flags().BoolVarP(&runDetached, "detach", "d", false, "run in background")
	rootCmd.AddCommand(runCmd)
}

func runRun(cmd *cobra.Command, args []string) error {
	demos, err := demosDir()
	if err != nil {
		return err
	}

	project := args[0]
	projectDir := filepath.Join(demos, project)
	composePath := filepath.Join(projectDir, "docker-compose.yml")

	if _, err := os.Stat(composePath); os.IsNotExist(err) {
		return fmt.Errorf("demo %q not found (no docker-compose.yml at %s)", project, projectDir)
	}

	// Show manifest info
	m, err := LoadManifest(projectDir)
	if err == nil {
		fmt.Printf("Starting: %s\n", m.Name)
		fmt.Printf("  %s\n", m.Description)
		if len(m.Ports) > 0 {
			fmt.Printf("  Ports: %v\n", m.Ports)
		}
		fmt.Println()
	}

	// Run docker compose
	dcArgs := []string{"compose", "-f", composePath, "up", "--build"}
	if runDetached {
		dcArgs = append(dcArgs, "-d")
	}

	c := exec.Command("docker", dcArgs...)
	c.Stdout = os.Stdout
	c.Stderr = os.Stderr
	c.Stdin = os.Stdin

	return c.Run()
}
