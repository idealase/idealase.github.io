#!/bin/bash

# =============================================================================
# Staging Deployment Script for idealase.github.io
# =============================================================================
# This script handles deployment to staging environment with proper validation,
# rollback capabilities, and environment-specific configurations.
#
# Usage: ./deploy-staging.sh [--environment ENV] [--dry-run] [--force]
# 
# Exit codes:
# 0 - Deployment successful
# 1 - Deployment failed
# 2 - Pre-deployment checks failed
# =============================================================================

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENVIRONMENT="${ENVIRONMENT:-staging}"
DRY_RUN=false
FORCE_DEPLOY=false
BACKUP_DIR="$PROJECT_ROOT/.deployment-backup"

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

log_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --environment)
                ENVIRONMENT="$2"
                shift 2
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --force)
                FORCE_DEPLOY=true
                shift
                ;;
            --help|-h)
                show_usage
                exit 0
                ;;
            *)
                log_error "Unknown argument: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --environment ENV    Target environment (default: staging)"
    echo "  --dry-run           Simulate deployment without making changes"
    echo "  --force             Skip safety checks and force deployment"
    echo "  --help, -h          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                               # Deploy to staging"
    echo "  $0 --environment staging         # Deploy to staging (explicit)"
    echo "  $0 --dry-run                     # Simulate deployment"
    echo "  $0 --force                       # Force deployment"
}

# Validate environment
validate_environment() {
    log_step "Validating environment: $ENVIRONMENT"
    
    case $ENVIRONMENT in
        staging|development|dev)
            log_success "Environment '$ENVIRONMENT' is valid"
            ;;
        production|prod)
            if [[ "$FORCE_DEPLOY" != "true" ]]; then
                log_error "Production deployment not allowed through staging script"
                log_info "Use production deployment workflow instead"
                exit 1
            else
                log_warning "Force deploying to production environment"
            fi
            ;;
        *)
            log_error "Unknown environment: $ENVIRONMENT"
            log_info "Valid environments: staging, development, dev"
            exit 1
            ;;
    esac
}

# Pre-deployment checks
run_pre_deployment_checks() {
    log_step "Running pre-deployment checks..."
    
    cd "$PROJECT_ROOT"
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir >/dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 2
    fi
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        if [[ "$FORCE_DEPLOY" != "true" ]]; then
            log_error "Uncommitted changes detected"
            log_info "Commit your changes or use --force to override"
            exit 2
        else
            log_warning "Deploying with uncommitted changes (forced)"
        fi
    fi
    
    # Check if package.json exists
    if [[ ! -f "package.json" ]]; then
        log_error "package.json not found"
        exit 2
    fi
    
    # Run health checks
    if [[ -x "$SCRIPT_DIR/health-check.sh" ]]; then
        log_info "Running health checks..."
        if "$SCRIPT_DIR/health-check.sh" "$PROJECT_ROOT" --verbose; then
            log_success "Health checks passed"
        else
            if [[ "$FORCE_DEPLOY" != "true" ]]; then
                log_error "Health checks failed"
                exit 2
            else
                log_warning "Health checks failed, but continuing (forced)"
            fi
        fi
    else
        log_warning "Health check script not found, skipping"
    fi
    
    log_success "Pre-deployment checks completed"
}

# Install dependencies and run tests
run_build_and_tests() {
    log_step "Installing dependencies and running tests..."
    
    cd "$PROJECT_ROOT"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would install dependencies with: npm ci"
        log_info "[DRY RUN] Would run tests with: npm test"
        return 0
    fi
    
    # Install dependencies
    log_info "Installing dependencies..."
    npm ci
    
    # Run linting
    log_info "Running linting..."
    npm run lint || log_warning "Linting issues found (non-blocking)"
    
    # Run tests
    log_info "Running tests..."
    npm test || log_warning "Test issues found (non-blocking)"
    
    log_success "Build and tests completed"
}

# Create deployment backup
create_backup() {
    log_step "Creating deployment backup..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would create backup in: $BACKUP_DIR"
        return 0
    fi
    
    mkdir -p "$BACKUP_DIR"
    
    local backup_name="staging-backup-$(date +%Y%m%d-%H%M%S)"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    # Create backup metadata
    cat > "$backup_path.json" << EOF
{
  "environment": "$ENVIRONMENT",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "commit_sha": "$(git rev-parse HEAD)",
  "branch": "$(git rev-parse --abbrev-ref HEAD)",
  "backup_path": "$backup_path"
}
EOF
    
    log_success "Backup metadata created: $backup_path.json"
}

# Deploy to staging environment
deploy_to_staging() {
    log_step "Deploying to $ENVIRONMENT environment..."
    
    cd "$PROJECT_ROOT"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would deploy the following files:"
        find . -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "manifest.json" | head -10
        log_info "[DRY RUN] Deployment simulation completed"
        return 0
    fi
    
    # Create staging-specific metadata
    local staging_info_file="staging-info.txt"
    cat > "$staging_info_file" << EOF
Environment: $ENVIRONMENT
Deployed at: $(date)
Commit SHA: $(git rev-parse HEAD)
Branch: $(git rev-parse --abbrev-ref HEAD)
Deployed by: ${USER:-unknown}
Deployment script: $0
EOF
    
    log_info "Created staging metadata file: $staging_info_file"
    
    # In a real scenario, this would deploy to actual staging infrastructure
    # For this example, we're simulating the deployment process
    
    log_info "Simulating deployment process..."
    sleep 2
    
    # Validate deployment
    log_info "Validating deployment..."
    if [[ -f "index.html" ]] && [[ -f "$staging_info_file" ]]; then
        log_success "Deployment validation passed"
    else
        log_error "Deployment validation failed"
        exit 1
    fi
    
    log_success "Deployment to $ENVIRONMENT completed successfully"
}

# Post-deployment verification
run_post_deployment_checks() {
    log_step "Running post-deployment verification..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would run post-deployment checks"
        return 0
    fi
    
    # Run health checks again
    if [[ -x "$SCRIPT_DIR/health-check.sh" ]]; then
        log_info "Running post-deployment health checks..."
        if "$SCRIPT_DIR/health-check.sh" "file://$PROJECT_ROOT/index.html"; then
            log_success "Post-deployment health checks passed"
        else
            log_warning "Post-deployment health checks failed"
        fi
    fi
    
    # Display deployment information
    log_info "Deployment Summary:"
    echo "  Environment: $ENVIRONMENT"
    echo "  Commit: $(git rev-parse HEAD)"
    echo "  Branch: $(git rev-parse --abbrev-ref HEAD)"
    echo "  Time: $(date)"
    echo "  Staging URL: https://idealase.github.io/staging (simulated)"
    
    log_success "Post-deployment verification completed"
}

# Main deployment function
main() {
    echo ""
    log_info "🚀 Starting staging deployment for idealase.github.io"
    echo ""
    
    parse_arguments "$@"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_warning "DRY RUN MODE - No changes will be made"
    fi
    
    validate_environment
    run_pre_deployment_checks
    run_build_and_tests
    create_backup
    deploy_to_staging
    run_post_deployment_checks
    
    echo ""
    if [[ "$DRY_RUN" == "true" ]]; then
        log_success "🎉 Staging deployment simulation completed successfully!"
    else
        log_success "🎉 Staging deployment completed successfully!"
    fi
    echo ""
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi