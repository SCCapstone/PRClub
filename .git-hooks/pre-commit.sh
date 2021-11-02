#!/bin/sh

BRANCH=$(git rev-parse --abbrev-ref HEAD)
REGEX="^(main|((feature|bugfix)\/(\b[a-z0-9]+(?:['-]?[a-z0-9]+)*\b)))$"

if ! [[ $BRANCH =~ $REGEX ]]; then
  echo "Your commit was rejected due to an invalid branch name!"
  echo "Please rename your branch using the syntax: $REGEX ."
  exit 1
fi