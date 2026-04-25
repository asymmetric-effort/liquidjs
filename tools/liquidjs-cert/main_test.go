package main

import (
	"crypto/ecdsa"
	"crypto/x509"
	"encoding/pem"
	"os"
	"path/filepath"
	"testing"
)

func TestGenerateCA(t *testing.T) {
	key, cert, certBytes := generateCA(365)

	if key == nil {
		t.Fatal("CA key is nil")
	}
	if cert == nil {
		t.Fatal("CA cert is nil")
	}
	if len(certBytes) == 0 {
		t.Fatal("CA cert bytes empty")
	}
	if !cert.IsCA {
		t.Error("CA cert should have IsCA=true")
	}
	if cert.Subject.CommonName != "LiquidJS Dev Root CA" {
		t.Errorf("CA CN = %q, want %q", cert.Subject.CommonName, "LiquidJS Dev Root CA")
	}
}

func TestGenerateLeaf(t *testing.T) {
	caKey, caCert, _ := generateCA(365)
	leafKey, leafCertBytes := generateLeaf(caKey, caCert, "localhost", "localhost,127.0.0.1", 30)

	if leafKey == nil {
		t.Fatal("leaf key is nil")
	}
	if len(leafCertBytes) == 0 {
		t.Fatal("leaf cert bytes empty")
	}

	leafCert, err := x509.ParseCertificate(leafCertBytes)
	if err != nil {
		t.Fatalf("parse leaf cert: %v", err)
	}
	if leafCert.Subject.CommonName != "localhost" {
		t.Errorf("leaf CN = %q, want %q", leafCert.Subject.CommonName, "localhost")
	}
	if len(leafCert.DNSNames) == 0 {
		t.Error("leaf cert should have DNS SANs")
	}
	if len(leafCert.IPAddresses) == 0 {
		t.Error("leaf cert should have IP SANs")
	}

	// Verify leaf is signed by CA
	roots := x509.NewCertPool()
	roots.AddCert(caCert)
	_, err = leafCert.Verify(x509.VerifyOptions{Roots: roots})
	if err != nil {
		t.Errorf("leaf cert verification failed: %v", err)
	}
}

func TestPemEncode(t *testing.T) {
	data := []byte("test data")
	encoded := pemEncode("CERTIFICATE", data)
	block, _ := pem.Decode(encoded)
	if block == nil {
		t.Fatal("PEM decode returned nil")
	}
	if block.Type != "CERTIFICATE" {
		t.Errorf("PEM type = %q, want CERTIFICATE", block.Type)
	}
}

func TestPemEncodeECKey(t *testing.T) {
	caKey, _, _ := generateCA(1)
	encoded := pemEncodeECKey(caKey)
	block, _ := pem.Decode(encoded)
	if block == nil {
		t.Fatal("PEM decode returned nil")
	}
	if block.Type != "EC PRIVATE KEY" {
		t.Errorf("PEM type = %q, want EC PRIVATE KEY", block.Type)
	}
	_, err := x509.ParseECPrivateKey(block.Bytes)
	if err != nil {
		t.Errorf("parse EC key: %v", err)
	}
}

func TestWriteFile(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "test.pem")
	writeFile(path, []byte("test content"))

	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("read file: %v", err)
	}
	if string(data) != "test content" {
		t.Errorf("file content = %q, want %q", string(data), "test content")
	}

	info, _ := os.Stat(path)
	if info.Mode().Perm() != 0o600 {
		t.Errorf("file perms = %o, want 600", info.Mode().Perm())
	}
}

func TestNewSerial(t *testing.T) {
	s1 := newSerial()
	s2 := newSerial()
	if s1.Cmp(s2) == 0 {
		t.Error("serial numbers should be unique")
	}
}

func TestEndToEnd(t *testing.T) {
	dir := t.TempDir()

	caKey, caCert, caCertBytes := generateCA(365)
	writeFile(filepath.Join(dir, "ca.pem"), pemEncode("CERTIFICATE", caCertBytes))
	writeFile(filepath.Join(dir, "ca-key.pem"), pemEncodeECKey(caKey))

	leafKey, leafCertBytes := generateLeaf(caKey, caCert, "localhost", "localhost,127.0.0.1,::1", 30)
	writeFile(filepath.Join(dir, "cert.pem"), pemEncode("CERTIFICATE", leafCertBytes))
	writeFile(filepath.Join(dir, "key.pem"), pemEncodeECKey(leafKey))

	// Verify all files exist
	for _, name := range []string{"ca.pem", "ca-key.pem", "cert.pem", "key.pem"} {
		if _, err := os.Stat(filepath.Join(dir, name)); err != nil {
			t.Errorf("missing file %s: %v", name, err)
		}
	}

	// Verify chain
	leafCert, _ := x509.ParseCertificate(leafCertBytes)
	roots := x509.NewCertPool()
	roots.AddCert(caCert)
	if _, err := leafCert.Verify(x509.VerifyOptions{Roots: roots}); err != nil {
		t.Errorf("chain verification failed: %v", err)
	}

	// Verify leaf key matches cert
	leafPub, ok := leafCert.PublicKey.(*ecdsa.PublicKey)
	if !ok {
		t.Fatal("leaf cert public key is not ECDSA")
	}
	if leafKey.PublicKey.X.Cmp(leafPub.X) != 0 || leafKey.PublicKey.Y.Cmp(leafPub.Y) != 0 {
		t.Error("leaf key does not match leaf cert")
	}
}
