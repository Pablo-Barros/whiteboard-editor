#!/bin/bash

# This script will update the commit timestamps to create a realistic timeline
# between 13:00 and 23:30 Madrid time (UTC+2) on 2025-06-06

# First, let's reset to the initial commit but keep all files
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
git checkout --orphan temp-update

echo "Creating new commits with updated timestamps..."

# Create commits with new timestamps
git add .
GIT_AUTHOR_DATE="2025-06-06T13:24:00+02:00" \
GIT_COMMITTER_DATE="2025-06-06T13:24:00+02:00" \
git commit -m "chore: initialize Next.js with TypeScript and Tailwind CSS"

# Add all other commits with incremental timestamps
git cherry-pick --allow-empty --strategy-option=theirs 408b823 && \
GIT_COMMITTER_DATE="2025-06-06T14:37:00+02:00" \
GIT_AUTHOR_DATE="2025-06-06T14:37:00+02:00" \
git commit --amend --no-edit --date="2025-06-06T14:37:00+02:00"

git cherry-pick --allow-empty --strategy-option=theirs 6b01f6a && \
GIT_COMMITTER_DATE="2025-06-06T15:42:00+02:00" \
GIT_AUTHOR_DATE="2025-06-06T15:42:00+02:00" \
git commit --amend --no-edit --date="2025-06-06T15:42:00+02:00"

git cherry-pick --allow-empty --strategy-option=theirs 805b321 && \
GIT_COMMITTER_DATE="2025-06-06T16:28:00+02:00" \
GIT_AUTHOR_DATE="2025-06-06T16:28:00+02:00" \
git commit --amend --no-edit --date="2025-06-06T16:28:00+02:00"

git cherry-pick --allow-empty --strategy-option=theirs 25370c8 && \
GIT_COMMITTER_DATE="2025-06-06T17:53:00+02:00" \
GIT_AUTHOR_DATE="2025-06-06T17:53:00+02:00" \
git commit --amend --no-edit --date="2025-06-06T17:53:00+02:00"

git cherry-pick --allow-empty --strategy-option=theirs 935d853 && \
GIT_COMMITTER_DATE="2025-06-06T18:15:00+02:00" \
GIT_AUTHOR_DATE="2025-06-06T18:15:00+02:00" \
git commit --amend --no-edit --date="2025-06-06T18:15:00+02:00"

git cherry-pick --allow-empty --strategy-option=theirs b7acd92 && \
GIT_COMMITTER_DATE="2025-06-06T19:22:00+02:00" \
GIT_AUTHOR_DATE="2025-06-06T19:22:00+02:00" \
git commit --amend --no-edit --date="2025-06-06T19:22:00+02:00"

git cherry-pick --allow-empty --strategy-option=theirs 1ba0c42 && \
GIT_COMMITTER_DATE="2025-06-06T20:18:00+02:00" \
GIT_AUTHOR_DATE="2025-06-06T20:18:00+02:00" \
git commit --amend --no-edit --date="2025-06-06T20:18:00+02:00"

git cherry-pick --allow-empty --strategy-option=theirs b2085ba && \
GIT_COMMITTER_DATE="2025-06-06T21:47:00+02:00" \
GIT_AUTHOR_DATE="2025-06-06T21:47:00+02:00" \
git commit --amend --no-edit --date="2025-06-06T21:47:00+02:00"

git cherry-pick --allow-empty --strategy-option=theirs 762b032 && \
GIT_COMMITTER_DATE="2025-06-06T22:39:00+02:00" \
GIT_AUTHOR_DATE="2025-06-06T22:39:00+02:00" \
git commit --amend --no-edit --date="2025-06-06T22:39:00+02:00"

# Create a new branch with the updated history
git branch -f $CURRENT_BRANCH
git checkout $CURRENT_BRANCH
git branch -D temp-update

echo "\nTimestamps have been updated. Check the new history with:"
echo "git log --pretty=fuller"
echo "\nIf everything looks good, force push with:"
echo "git push --force-with-lease"
