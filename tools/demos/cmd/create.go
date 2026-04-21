package cmd

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/spf13/cobra"
	"gopkg.in/yaml.v3"
)

var createDescription string

var createCmd = &cobra.Command{
	Use:   "create <project>",
	Short: "Create a new demo project skeleton",
	Long:  `Creates a new demo project directory with Dockerfile, docker-compose.yml, manifest.yaml, and source stubs.`,
	Args:  cobra.ExactArgs(1),
	RunE:  runCreate,
}

func init() {
	createCmd.Flags().StringVarP(&createDescription, "description", "d", "", "project description")
	rootCmd.AddCommand(createCmd)
}

var validName = regexp.MustCompile(`^[a-z][a-z0-9-]*$`)

func runCreate(cmd *cobra.Command, args []string) error {
	demos, err := demosDir()
	if err != nil {
		return err
	}

	name := args[0]

	if !validName.MatchString(name) {
		return fmt.Errorf("invalid project name %q: must be lowercase alphanumeric with hyphens", name)
	}

	projectDir := filepath.Join(demos, name)

	if _, err := os.Stat(projectDir); err == nil {
		return fmt.Errorf("demo %q already exists at %s", name, projectDir)
	}

	if createDescription == "" {
		createDescription = fmt.Sprintf("LiquidJS %s demo", strings.ReplaceAll(name, "-", " "))
	}

	// Create directory structure
	dirs := []string{
		filepath.Join(projectDir, "ui", "src"),
	}
	for _, d := range dirs {
		if err := os.MkdirAll(d, 0o755); err != nil {
			return fmt.Errorf("creating directory %s: %w", d, err)
		}
	}

	// Write manifest.yaml
	manifest := Manifest{
		Name:        name,
		Description: createDescription,
		Features:    []string{"useState", "useEffect"},
		Containers:  1,
		Ports:       []string{"3000:80"},
	}
	manifestData, _ := yaml.Marshal(&manifest)
	if err := os.WriteFile(filepath.Join(projectDir, "manifest.yaml"), manifestData, 0o644); err != nil {
		return err
	}

	// Write docker-compose.yml
	compose := fmt.Sprintf(`services:
  ui:
    build:
      context: ../..
      dockerfile: demos/%s/ui/Dockerfile
    ports:
      - "3000:80"
    restart: unless-stopped
`, name)
	if err := os.WriteFile(filepath.Join(projectDir, "docker-compose.yml"), []byte(compose), 0o644); err != nil {
		return err
	}

	// Write Dockerfile
	dockerfile := fmt.Sprintf(`FROM node:18-alpine AS build
WORKDIR /app
COPY core/src/ /liquidjs-core/src/
COPY demos/%s/ui/package.json ./
RUN npm install
COPY demos/%s/ui/ ./
RUN echo 'import { defineConfig } from "vite"; export default defineConfig({ resolve: { alias: { "liquidjs/hooks": "/liquidjs-core/src/hooks/index.ts", "liquidjs/dom": "/liquidjs-core/src/dom/index.ts", "liquidjs": "/liquidjs-core/src/index.ts" } }, build: { outDir: "dist", minify: "esbuild" } });' > vite.config.js && rm -f vite.config.ts
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
`, name, name)
	if err := os.WriteFile(filepath.Join(projectDir, "ui", "Dockerfile"), []byte(dockerfile), 0o644); err != nil {
		return err
	}

	// Write package.json
	pkg := fmt.Sprintf(`{
  "name": "liquidjs-demo-%s",
  "private": true,
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build" },
  "devDependencies": { "typescript": "^5.6.0", "vite": "^6.4.0" }
}
`, name)
	if err := os.WriteFile(filepath.Join(projectDir, "ui", "package.json"), []byte(pkg), 0o644); err != nil {
		return err
	}

	// Write index.html stub
	html := fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LiquidJS %s Demo</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./src/app.ts"></script>
</body>
</html>
`, name)
	if err := os.WriteFile(filepath.Join(projectDir, "ui", "index.html"), []byte(html), 0o644); err != nil {
		return err
	}

	// Write app.ts stub
	appTs := `import { createElement } from 'liquidjs';
import { useState } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';

function App() {
  const [message] = useState('Hello from LiquidJS!');
  return createElement('div', { className: 'app' },
    createElement('h1', null, message),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
`
	if err := os.WriteFile(filepath.Join(projectDir, "ui", "src", "app.ts"), []byte(appTs), 0o644); err != nil {
		return err
	}

	// Write README
	readme := fmt.Sprintf("# %s Demo\n\n%s\n\n## Run\n\n```bash\ndocker compose up --build\n```\n\nOpen http://localhost:3000\n", name, createDescription)
	if err := os.WriteFile(filepath.Join(projectDir, "README.md"), []byte(readme), 0o644); err != nil {
		return err
	}

	fmt.Printf("Created demo: %s\n", name)
	fmt.Printf("  Directory: %s\n", projectDir)
	fmt.Println("  Files created:")
	fmt.Println("    manifest.yaml")
	fmt.Println("    docker-compose.yml")
	fmt.Println("    ui/Dockerfile")
	fmt.Println("    ui/package.json")
	fmt.Println("    ui/index.html")
	fmt.Println("    ui/src/app.ts")
	fmt.Println("    README.md")

	return nil
}
