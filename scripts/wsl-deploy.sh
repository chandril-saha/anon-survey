#!/bin/bash
# Helper script to run deploy in WSL with correct Linux Node.js via NVM
set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

nvm use 22

echo "=== Node/npm info ==="
echo "node: $(which node) $(node --version)"
echo "npm:  $(which npm) $(npm --version)"
echo "====================="

cd /mnt/e/workspace/anon-survey

# Install the Linux esbuild binary if not already present
if [ ! -d "node_modules/@esbuild/linux-x64" ]; then
  echo "Installing @esbuild/linux-x64..."
  npm install @esbuild/linux-x64
fi

echo ""
echo "Running deploy..."
npx tsx src/deploy.ts --network preview
