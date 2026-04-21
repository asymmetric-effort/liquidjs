package cmd

import (
	"fmt"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"
)

// Manifest represents a demo project's manifest.yaml.
type Manifest struct {
	Name        string   `yaml:"name"`
	Description string   `yaml:"description"`
	Features    []string `yaml:"features"`
	Containers  int      `yaml:"containers"`
	Ports       []string `yaml:"ports"`
}

// LoadManifest reads a manifest.yaml from a demo project directory.
func LoadManifest(projectDir string) (*Manifest, error) {
	data, err := os.ReadFile(filepath.Join(projectDir, "manifest.yaml"))
	if err != nil {
		return nil, fmt.Errorf("reading manifest: %w", err)
	}

	var m Manifest
	if err := yaml.Unmarshal(data, &m); err != nil {
		return nil, fmt.Errorf("parsing manifest: %w", err)
	}

	return &m, nil
}

// ListProjects finds all demo projects with manifest.yaml files.
func ListProjects(demosPath string) ([]string, error) {
	entries, err := os.ReadDir(demosPath)
	if err != nil {
		return nil, err
	}

	var projects []string
	for _, e := range entries {
		if !e.IsDir() {
			continue
		}
		manifestPath := filepath.Join(demosPath, e.Name(), "manifest.yaml")
		if _, err := os.Stat(manifestPath); err == nil {
			projects = append(projects, e.Name())
		}
	}

	return projects, nil
}
