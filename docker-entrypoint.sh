#!/bin/sh
set -e

# Schema changes must be applied explicitly before deploying a release that needs
# them. Starting the web server must not download a CLI or mutate production data.
echo "Starting server..."
exec bun server.js
