#!/bin/sh
set -e

echo "Running database migrations..."
bunx prisma db push --accept-data-loss

echo "Starting server..."
exec bun server.js
