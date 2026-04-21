// liquidjs-debug provides tools for deobfuscating, deminifying, decompressing,
// and analyzing LiquidJS application bundles for debugging and reverse-engineering.
package main

import (
	"os"

	"github.com/nickolasgb/liquidjs/tools/liquidjs-debug/cmd"
)

func main() {
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
