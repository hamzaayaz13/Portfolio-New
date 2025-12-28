#!/bin/bash
# Safe dev server startup script - only affects port 3005

echo "Starting Portfolio dev server on port 3005..."

# Only kill processes on port 3005, not other ports
lsof -ti:3005 | xargs kill -9 2>/dev/null || true

# Wait a moment for port to be released
sleep 1

# Start the dev server on port 3005 only
cd "$(dirname "$0")"
npm run dev:new




