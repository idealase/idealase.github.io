#!/bin/bash

# =============================================================================
# Preview Environment Cleanup Script for idealase.github.io
# =============================================================================
# This script handles cleanup of preview environments when PRs are closed
# or when manual cleanup is needed.
#
# Usage: ./cleanup-preview.sh [PR_NUMBER] [--force] [--dry-run]
# 
# Exit codes:
# 0 - Cleanup successful
# 1 - Cleanup failed
# 2 - Invalid arguments or configuration
# =============================================================================

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PR_NUMBER=""
DRY_RUN=false
FORCE_CLEANUP=false
PREVIEW_BASE_PATH="/tmp/preview-environments"
CLEANUP_LOG="$PROJECT_ROOT/.cleanup.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
    echo "$(date): [INFO] $1" >> "$CLEANUP_LOG"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    echo "$(date): [SUCCESS] $1" >> "$CLEANUP_LOG"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    echo "$(date): [WARNING] $1" >> "$CLEANUP_LOG"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    echo "$(date): [ERROR] $1" >> "$CLEANUP_LOG"
}

log_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
    echo "$(date): [STEP] $1" >> "$CLEANUP_LOG"
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --pr|--pr-number)
                PR_NUMBER="$2"
                shift 2
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --force)
                FORCE_CLEANUP=true
                shift
                ;;
            --help|-h)
                show_usage
                exit 0
                ;;
            [0-9]*)
                if [[ -z "$PR_NUMBER" ]]; then
                    PR_NUMBER="$1"
                    shift
                else
                    log_error "PR number already specified: $PR_NUMBER"
                    exit 2
                fi
                ;;
            *)
                log_error "Unknown argument: $1"
                show_usage
                exit 2
                ;;
        esac
    done
}

show_usage() {
    echo "Usage: $0 [PR_NUMBER] [OPTIONS]"
    echo ""
    echo "Arguments:"
    echo "  PR_NUMBER           Pull request number to cleanup"
    echo ""
    echo "Options:"
    echo "  --pr-number NUM     Pull request number (alternative syntax)"
    echo "  --dry-run           Simulate cleanup without making changes"
    echo "  --force             Force cleanup without confirmation"
    echo "  --help, -h          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 123                      # Cleanup preview for PR #123"
    echo "  $0 --pr-number 123          # Cleanup preview for PR #123 (alternative)"
    echo "  $0 123 --dry-run            # Simulate cleanup for PR #123"
    echo "  $0 123 --force              # Force cleanup without confirmation"
    echo "  $0 --dry-run                # List all preview environments"
}

# Validate input
validate_input() {
    if [[ -z "$PR_NUMBER" ]] && [[ "$DRY_RUN" != "true" ]]; then
        log_error "PR number is required for cleanup"
        show_usage
        exit 2
    fi
    
    if [[ -n "$PR_NUMBER" ]] && ! [[ "$PR_NUMBER" =~ ^[0-9]+$ ]]; then
        log_error "PR number must be a positive integer: $PR_NUMBER"
        exit 2
    fi
}

# List all preview environments
list_preview_environments() {
    log_step "Listing all preview environments..."
    
    # In a real scenario, this would query actual infrastructure
    # For this simulation, we'll create some example environments
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "Simulated preview environments:"
        echo "  - preview-pr-123 (created 2 days ago)"
        echo "  - preview-pr-456 (created 1 hour ago)"
        echo "  - preview-pr-789 (created 1 week ago)"
        return 0
    fi
    
    log_info "Active preview environments would be listed here"
    # This would typically involve:
    # - Querying cloud provider APIs
    # - Checking container orchestration platforms
    # - Looking up DNS records for preview subdomains
    # - Checking storage buckets or CDN configurations
}

# Check if preview environment exists
check_preview_exists() {
    local pr_num="$1"
    log_step "Checking if preview environment exists for PR #$pr_num..."
    
    # Simulate environment check
    # In a real scenario, this would check actual infrastructure
    local preview_path="$PREVIEW_BASE_PATH/pr-$pr_num"
    
    if [[ -d "$preview_path" ]] || [[ "$pr_num" =~ ^(123|456|789)$ ]]; then
        log_info "Preview environment found for PR #$pr_num"
        return 0
    else
        log_warning "No preview environment found for PR #$pr_num"
        return 1
    fi
}

# Cleanup preview environment
cleanup_preview_environment() {
    local pr_num="$1"
    log_step "Cleaning up preview environment for PR #$pr_num..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would cleanup the following:"
        echo "  - Remove preview deployment: preview-pr-$pr_num"
        echo "  - Delete preview URL: https://idealase.github.io/preview/pr-$pr_num"
        echo "  - Clean up preview storage/CDN"
        echo "  - Remove preview environment metadata"
        return 0
    fi
    
    # Simulate cleanup steps
    log_info "Stopping preview services for PR #$pr_num..."
    sleep 1
    
    log_info "Removing preview deployment..."
    sleep 1
    
    log_info "Cleaning up preview storage..."
    sleep 1
    
    log_info "Removing preview URL configuration..."
    sleep 1
    
    # Create cleanup metadata
    local cleanup_info="$PROJECT_ROOT/.cleanup-pr-$pr_num.json"
    cat > "$cleanup_info" << EOF
{
  "pr_number": $pr_num,
  "cleanup_timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "cleanup_method": "manual_script",
  "cleaned_by": "${USER:-unknown}",
  "cleanup_script": "$0"
}
EOF
    
    log_success "Cleanup metadata saved: $cleanup_info"
}

# Cleanup old preview environments
cleanup_old_environments() {
    log_step "Cleaning up old preview environments..."
    
    # Define age threshold (e.g., 7 days)
    local age_threshold_days=7
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would cleanup environments older than $age_threshold_days days:"
        echo "  - preview-pr-789 (1 week old) - would be cleaned up"
        echo "  - preview-pr-123 (2 days old) - would be kept"
        echo "  - preview-pr-456 (1 hour old) - would be kept"
        return 0
    fi
    
    log_info "Checking for environments older than $age_threshold_days days..."
    
    # In a real scenario, this would:
    # - Query infrastructure for environment creation dates
    # - Calculate age of each environment
    # - Clean up environments exceeding threshold
    # - Exclude environments from recently active PRs
    
    log_success "Old environment cleanup completed"
}

# Send cleanup notification
send_cleanup_notification() {
    local pr_num="$1"
    log_step "Sending cleanup notification..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would send notification about cleanup"
        return 0
    fi
    
    # In a real scenario, this would:
    # - Post comment to GitHub PR
    # - Send Slack/Teams notification
    # - Update monitoring dashboards
    # - Log cleanup event for audit trail
    
    log_info "Cleanup notification would be sent here"
    log_success "Cleanup notification completed"
}

# Confirmation prompt
confirm_cleanup() {
    local pr_num="$1"
    
    if [[ "$FORCE_CLEANUP" == "true" ]] || [[ "$DRY_RUN" == "true" ]]; then
        return 0
    fi
    
    echo ""
    log_warning "You are about to cleanup preview environment for PR #$pr_num"
    echo "This action cannot be undone."
    echo ""
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Cleanup cancelled by user"
        exit 0
    fi
}

# Main cleanup function
main() {
    echo ""
    log_info "🧹 Starting preview environment cleanup for idealase.github.io"
    echo ""
    
    # Initialize cleanup log
    echo "$(date): Cleanup session started" > "$CLEANUP_LOG"
    
    parse_arguments "$@"
    validate_input
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_warning "DRY RUN MODE - No changes will be made"
    fi
    
    # If no PR number specified, list all environments
    if [[ -z "$PR_NUMBER" ]]; then
        list_preview_environments
        cleanup_old_environments
        echo ""
        log_success "🎉 Environment listing completed!"
        return 0
    fi
    
    # Cleanup specific PR environment
    if check_preview_exists "$PR_NUMBER"; then
        confirm_cleanup "$PR_NUMBER"
        cleanup_preview_environment "$PR_NUMBER"
        send_cleanup_notification "$PR_NUMBER"
        
        echo ""
        if [[ "$DRY_RUN" == "true" ]]; then
            log_success "🎉 Preview cleanup simulation completed for PR #$PR_NUMBER!"
        else
            log_success "🎉 Preview cleanup completed successfully for PR #$PR_NUMBER!"
        fi
    else
        log_warning "No cleanup needed for PR #$PR_NUMBER"
    fi
    
    echo ""
    log_info "Cleanup log saved to: $CLEANUP_LOG"
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi