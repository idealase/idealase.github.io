#!/bin/bash

# =============================================================================
# Health Check Script for idealase.github.io
# =============================================================================
# This script performs comprehensive health checks for the static website
# to ensure all critical components are functioning properly.
#
# Usage: ./health-check.sh [URL] [--verbose]
# 
# Exit codes:
# 0 - All health checks passed
# 1 - Critical health check failed
# 2 - Warning: Non-critical issues found
# =============================================================================

set -euo pipefail

# Configuration
SITE_URL="${1:-https://idealase.github.io}"
VERBOSE="${2:-}"
TIMEOUT=30
RETRY_COUNT=3

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_verbose() {
    if [[ "$VERBOSE" == "--verbose" ]]; then
        echo -e "${BLUE}[VERBOSE]${NC} $1"
    fi
}

# Health check functions
check_file_exists() {
    local file="$1"
    local description="$2"
    
    if [[ -f "$file" ]]; then
        log_success "$description exists: $file"
        return 0
    else
        log_error "$description missing: $file"
        return 1
    fi
}

check_critical_files() {
    log_info "Checking critical files..."
    local failed=0
    
    check_file_exists "index.html" "Main HTML file" || failed=1
    check_file_exists "manifest.json" "PWA manifest" || failed=1
    
    # Optional files (warnings only)
    check_file_exists "css/style.css" "Main CSS file" || log_warning "CSS file not found at expected location"
    check_file_exists "js/main.js" "Main JavaScript file" || log_warning "JS file not found at expected location"
    check_file_exists "favicon.ico" "Favicon" || log_warning "Favicon not found"
    
    return $failed
}

check_html_validity() {
    log_info "Checking HTML validity..."
    
    if command -v html-validate >/dev/null 2>&1; then
        if html-validate index.html >/dev/null 2>&1; then
            log_success "HTML validation passed"
            return 0
        else
            log_warning "HTML validation issues found (non-blocking)"
            return 0
        fi
    else
        log_verbose "html-validate not found, skipping HTML validation"
        return 0
    fi
}

check_site_accessibility() {
    log_info "Checking site accessibility (basic)..."
    
    # Basic accessibility checks on local files
    if [[ -f "index.html" ]]; then
        # Check for basic accessibility attributes
        if grep -q 'alt=' index.html; then
            log_success "Alt attributes found in HTML"
        else
            log_warning "No alt attributes found in HTML"
        fi
        
        if grep -q 'lang=' index.html; then
            log_success "Language attribute found in HTML"
        else
            log_warning "No language attribute found in HTML"
        fi
    fi
    
    return 0
}

check_site_response() {
    log_info "Checking site response: $SITE_URL"
    
    # Only check if curl is available and URL looks like a web URL
    if command -v curl >/dev/null 2>&1 && [[ "$SITE_URL" =~ ^https?:// ]]; then
        local attempt=1
        while [[ $attempt -le $RETRY_COUNT ]]; do
            log_verbose "Attempt $attempt/$RETRY_COUNT: Checking $SITE_URL"
            
            if curl -sS --max-time $TIMEOUT --fail "$SITE_URL" >/dev/null; then
                log_success "Site is responding (HTTP 200)"
                return 0
            else
                log_warning "Site check failed (attempt $attempt/$RETRY_COUNT)"
                ((attempt++))
                sleep 2
            fi
        done
        
        log_error "Site is not responding after $RETRY_COUNT attempts"
        return 1
    else
        log_verbose "Skipping site response check (curl not available or invalid URL)"
        return 0
    fi
}

check_performance_basics() {
    log_info "Checking basic performance indicators..."
    
    if [[ -f "index.html" ]]; then
        local file_size=$(stat -c%s "index.html" 2>/dev/null || stat -f%z "index.html" 2>/dev/null || echo "unknown")
        if [[ "$file_size" != "unknown" ]]; then
            log_verbose "index.html size: $file_size bytes"
            if [[ $file_size -gt 100000 ]]; then
                log_warning "index.html is large (>100KB): $file_size bytes"
            else
                log_success "index.html size is reasonable: $file_size bytes"
            fi
        fi
    fi
    
    return 0
}

check_security_headers() {
    log_info "Checking security considerations..."
    
    if [[ -f "index.html" ]]; then
        # Check for security-related meta tags
        if grep -q 'Content-Security-Policy\|X-Frame-Options\|X-Content-Type-Options' index.html; then
            log_success "Security headers/meta tags found"
        else
            log_warning "No security headers/meta tags found"
        fi
    fi
    
    return 0
}

# Main health check function
run_health_checks() {
    log_info "Starting health checks for idealase.github.io..."
    log_info "Target: $SITE_URL"
    echo ""
    
    local critical_failed=0
    local warnings=0
    
    # Critical checks
    check_critical_files || critical_failed=1
    check_html_validity || warnings=1
    check_site_accessibility || warnings=1
    check_site_response || critical_failed=1
    check_performance_basics || warnings=1
    check_security_headers || warnings=1
    
    echo ""
    log_info "Health check summary:"
    
    if [[ $critical_failed -eq 0 ]]; then
        log_success "All critical health checks passed ✅"
        if [[ $warnings -gt 0 ]]; then
            log_warning "Some non-critical issues found ⚠️"
            echo ""
            log_info "Exit code: 2 (warnings present)"
            return 2
        else
            log_success "No issues found 🎉"
            echo ""
            log_info "Exit code: 0 (success)"
            return 0
        fi
    else
        log_error "Critical health checks failed ❌"
        echo ""
        log_info "Exit code: 1 (critical failure)"
        return 1
    fi
}

# Display usage information
show_usage() {
    echo "Usage: $0 [URL] [--verbose]"
    echo ""
    echo "Arguments:"
    echo "  URL       Site URL to check (default: https://idealase.github.io)"
    echo "  --verbose Enable verbose output"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Check default URL"
    echo "  $0 https://example.com               # Check custom URL"
    echo "  $0 https://example.com --verbose     # Check with verbose output"
    echo ""
    echo "Exit codes:"
    echo "  0 - All checks passed"
    echo "  1 - Critical checks failed"
    echo "  2 - Warnings present"
}

# Main execution
main() {
    if [[ "${1:-}" == "--help" ]] || [[ "${1:-}" == "-h" ]]; then
        show_usage
        exit 0
    fi
    
    run_health_checks
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi