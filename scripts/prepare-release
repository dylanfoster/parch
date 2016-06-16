#!/bin/bash
set -e

if [ "$DEBUG" = true ]; then
  set -x
fi

DEFAULT_VERSION_TYPE="patch"
current_version=$(cat package.json | grep version | cut -d \: -f 2 | tr -d '"' | tr -d ',')
version_type=$1

if [ -z $version_type ]; then
  version_type=$DEFAULT_VERSION_TYPE
fi

info() {
  log "\033[1;32m==> $@\033[0m";
}

log(){
  echo -e "$1";
}

generate_changelog() {
  info "Generating changelog"
  if [ "$DRY_RUN" = true ]; then
    return
  fi
  npm run changelog
}

add_to_git() {
  info "Adding changes to git"
  if [ "$DRY_RUN" = true ]; then
    return
  fi
  git add -Av
}

bump_package_version() {
  info "Updating package version from$current_version by $version_type"
  if [ "$DRY_RUN" = true ]; then
    return
  fi
  npm version $version_type --no-git-tag-version
}

commit() {
  info "Committing changes to git"
  if [ "$DRY_RUN" = true ]; then
    return
  fi
  git commit -m "$1"
}

if [ "$DRY_RUN" = true ]; then
  log "\r\nRunning in dry-run. No changes will be commited\r\n"
fi
bump_package_version
add_to_git
commit "chore(package): bump version"
generate_changelog
add_to_git
commit "docs(CHANGELOG): bump version"
