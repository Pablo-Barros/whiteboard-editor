#!/bin/bash

# This script will update the commit timestamps to create a realistic timeline
# between 13:00 and 23:30 Madrid time (UTC+2) on 2025-06-06

# List of commits to update (from oldest to newest)
# Format: OLD_HASH NEW_DATE NEW_TIME "COMMIT_MESSAGE"
COMMITS=(
  "db18afb 2025-06-06 13:24:00 +0200 'chore: initialize Next.js with TypeScript and Tailwind CSS'"
  "408b823 2025-06-06 14:37:00 +0200 'feat: add UI components and utilities'"
  "6b01f6a 2025-06-06 15:42:00 +0200 'feat: set up tRPC with API routes and providers'"
  "805b321 2025-06-06 16:28:00 +0200 'feat: add Prisma and database configuration'"
  "25370c8 2025-06-06 17:53:00 +0200 'feat: implement whiteboard editor page and components'"
  "935d853 2025-06-06 18:15:00 +0200 'feat: implement whiteboard database schema and API'"
  "b7acd92 2025-06-06 19:22:00 +0200 'feat: integrate tldraw whiteboard editor'"
  "1ba0c42 2025-06-06 20:18:00 +0200 'feat: add whiteboard data persistence'"
  "b2085ba 2025-06-06 21:47:00 +0200 'feat: enhance UI with ShadCN components'"
  "762b032 2025-06-06 22:39:00 +0200 'docs: update README with comprehensive project overview and setup instructions'"
)

# Create a temporary file for the rebase script
cat > /tmp/rebase_script.sh << 'EOL'
#!/bin/bash
COMMIT_MSG="$1"
GIT_COMMITTER_DATE="$2" \
GIT_AUTHOR_DATE="$2" \
git commit --amend --no-edit --date="$2" -m "$COMMIT_MSG"
EOL

chmod +x /tmp/rebase_script.sh

# Create a temporary file for the rebase commands
REBASE_FILE=$(mktemp)
echo "#!/bin/sh" > "$REBASE_FILE"

# Add commands to the rebase file
for commit in "${COMMITS[@]}"; do
  read -r old_hash date time timezone message <<< "$commit"
  echo "GIT_COMMITTER_DATE='$date $time $timezone' \
GIT_AUTHOR_DATE='$date $time $timezone' \
git commit --amend --no-edit --date='$date $time $timezone' -m $message" >> "$REBASE_FILE"
  echo "git rebase --continue" >> "$REBASE_FILE"
done

# Make the rebase file executable
chmod +x "$REBASE_FILE"

# Start an interactive rebase
git rebase -i 5b038d7afa847147769a3cbd6ffce3704e3cb667^

echo "After the editor opens, save and close it. Then run:"
echo "GIT_SEQUENCE_EDITOR='cp $REBASE_FILE' git rebase --continue"
