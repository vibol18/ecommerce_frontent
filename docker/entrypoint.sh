#!/bin/sh
set -e

PORT="${PORT:-8080}"

# Substitute __PORT__ placeholder with actual Render PORT
sed "s/__PORT__/$PORT/g" /etc/nginx/templates/default.conf > /etc/nginx/conf.d/default.conf

# Start nginx in foreground
exec nginx -g "daemon off;"
