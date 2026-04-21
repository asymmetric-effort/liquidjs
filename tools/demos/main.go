// demos is a CLI tool for managing LiquidJS demonstration projects.
package main

import (
	"os"

	"github.com/nickolasgb/liquidjs/tools/demos/cmd"
)

func main() {
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
