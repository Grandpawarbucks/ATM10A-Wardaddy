#!/bin/bash
# Copy pack files (config, defaultconfigs, kubejs) from the CurseForge instance into pack/,
# then refresh the packwiz index. Mods are NOT synced here: add them with
#   cd pack && packwiz curseforge add <slug>   (or: packwiz modrinth add <slug>)
# Usage: tools/sync_from_instance.sh [path-to-instance]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
INST="${1:-$HOME/Documents/curseforge/minecraft/Instances/All the Mods 10 Aeronautics ATM10A}"
PACKWIZ="$(command -v packwiz || echo "$HOME/go/bin/packwiz")"
for d in config defaultconfigs kubejs; do
  rsync -a --delete \
    --exclude '*.bak' --exclude '.DS_Store' \
    --exclude 'kubejs/probe/' --exclude 'probe/' --exclude 'exported/' \
    "$INST/$d/" "$ROOT/pack/$d/"
done
cd "$ROOT/pack" && "$PACKWIZ" refresh
echo "Synced from: $INST"
echo "Next: bump 'version' in pack/pack.toml if you like, then git add -A && git commit && git push"
