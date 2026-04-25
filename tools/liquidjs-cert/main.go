// liquidjs-cert generates self-signed CA chains and leaf certificates
// for local HTTPS development with LiquidJS.
//
// Usage:
//
//	liquidjs-cert [options]
//	  -out string    Output directory (default "certs")
//	  -cn string     Common name for leaf cert (default "localhost")
//	  -sans string   Comma-separated SANs (default "localhost,127.0.0.1")
//	  -days int      Certificate validity in days (default 365)
//	  -ca-days int   CA validity in days (default 3650)
package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"flag"
	"fmt"
	"math/big"
	"net"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func main() {
	outDir := flag.String("out", "certs", "Output directory for certificate files")
	cn := flag.String("cn", "localhost", "Common name for leaf certificate")
	sans := flag.String("sans", "localhost,127.0.0.1", "Comma-separated Subject Alternative Names")
	days := flag.Int("days", 365, "Leaf certificate validity in days")
	caDays := flag.Int("ca-days", 3650, "CA certificate validity in days")
	flag.Parse()

	if err := os.MkdirAll(*outDir, 0o755); err != nil {
		fatalf("create output dir: %v", err)
	}

	// Generate CA
	caKey, caCert, caCertBytes := generateCA(*caDays)
	writeFile(filepath.Join(*outDir, "ca.pem"), pemEncode("CERTIFICATE", caCertBytes))
	writeFile(filepath.Join(*outDir, "ca-key.pem"), pemEncodeECKey(caKey))

	// Generate leaf certificate
	leafKey, leafCertBytes := generateLeaf(caKey, caCert, *cn, *sans, *days)
	writeFile(filepath.Join(*outDir, "cert.pem"), pemEncode("CERTIFICATE", leafCertBytes))
	writeFile(filepath.Join(*outDir, "key.pem"), pemEncodeECKey(leafKey))

	fmt.Printf("Certificates generated in %s/\n", *outDir)
	fmt.Printf("  CA:   ca.pem, ca-key.pem (valid %d days)\n", *caDays)
	fmt.Printf("  Leaf: cert.pem, key.pem (CN=%s, valid %d days)\n", *cn, *days)
	fmt.Printf("  SANs: %s\n", *sans)
	fmt.Println()
	fmt.Println("To trust the CA on macOS:")
	fmt.Printf("  sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain %s/ca.pem\n", *outDir)
	fmt.Println()
	fmt.Println("To trust the CA on Linux:")
	fmt.Printf("  sudo cp %s/ca.pem /usr/local/share/ca-certificates/liquidjs-dev.crt && sudo update-ca-certificates\n", *outDir)
}

func generateCA(validDays int) (*ecdsa.PrivateKey, *x509.Certificate, []byte) {
	key, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		fatalf("generate CA key: %v", err)
	}

	serial := newSerial()
	template := &x509.Certificate{
		SerialNumber: serial,
		Subject: pkix.Name{
			Organization: []string{"LiquidJS Development CA"},
			CommonName:   "LiquidJS Dev Root CA",
		},
		NotBefore:             time.Now().Add(-1 * time.Hour),
		NotAfter:              time.Now().Add(time.Duration(validDays) * 24 * time.Hour),
		KeyUsage:              x509.KeyUsageCertSign | x509.KeyUsageCRLSign,
		BasicConstraintsValid: true,
		IsCA:                  true,
		MaxPathLen:            1,
	}

	certBytes, err := x509.CreateCertificate(rand.Reader, template, template, &key.PublicKey, key)
	if err != nil {
		fatalf("create CA cert: %v", err)
	}

	cert, err := x509.ParseCertificate(certBytes)
	if err != nil {
		fatalf("parse CA cert: %v", err)
	}

	return key, cert, certBytes
}

func generateLeaf(caKey *ecdsa.PrivateKey, caCert *x509.Certificate, cn, sans string, validDays int) (*ecdsa.PrivateKey, []byte) {
	key, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		fatalf("generate leaf key: %v", err)
	}

	var dnsNames []string
	var ipAddrs []net.IP
	for _, san := range strings.Split(sans, ",") {
		san = strings.TrimSpace(san)
		if san == "" {
			continue
		}
		if ip := net.ParseIP(san); ip != nil {
			ipAddrs = append(ipAddrs, ip)
		} else {
			dnsNames = append(dnsNames, san)
		}
	}

	template := &x509.Certificate{
		SerialNumber: newSerial(),
		Subject: pkix.Name{
			Organization: []string{"LiquidJS Development"},
			CommonName:   cn,
		},
		NotBefore:   time.Now().Add(-1 * time.Hour),
		NotAfter:    time.Now().Add(time.Duration(validDays) * 24 * time.Hour),
		KeyUsage:    x509.KeyUsageDigitalSignature | x509.KeyUsageKeyEncipherment,
		ExtKeyUsage: []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		DNSNames:    dnsNames,
		IPAddresses: ipAddrs,
	}

	certBytes, err := x509.CreateCertificate(rand.Reader, template, caCert, &key.PublicKey, caKey)
	if err != nil {
		fatalf("create leaf cert: %v", err)
	}

	return key, certBytes
}

func newSerial() *big.Int {
	serial, err := rand.Int(rand.Reader, new(big.Int).Lsh(big.NewInt(1), 128))
	if err != nil {
		fatalf("generate serial: %v", err)
	}
	return serial
}

func pemEncode(blockType string, data []byte) []byte {
	return pem.EncodeToMemory(&pem.Block{Type: blockType, Bytes: data})
}

func pemEncodeECKey(key *ecdsa.PrivateKey) []byte {
	der, err := x509.MarshalECPrivateKey(key)
	if err != nil {
		fatalf("marshal EC key: %v", err)
	}
	return pem.EncodeToMemory(&pem.Block{Type: "EC PRIVATE KEY", Bytes: der})
}

func writeFile(path string, data []byte) {
	if err := os.WriteFile(path, data, 0o600); err != nil {
		fatalf("write %s: %v", path, err)
	}
}

func fatalf(format string, args ...interface{}) {
	fmt.Fprintf(os.Stderr, "liquidjs-cert: "+format+"\n", args...)
	os.Exit(1)
}
