#!/bin/sh
set -e

echo "Running database migrations..."
bunx prisma db push --skip-generate --accept-data-loss

echo "Starting server..."
exec bun server.js
