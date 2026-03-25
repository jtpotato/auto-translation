#!/bin/bash
set -e

APP_NAME="auto-translation"
IMAGE_NAME="auto-translation:latest"
# HOST_PORT="3000"
# CONTAINER_PORT="3000"

echo "==> Pulling latest code..."
git pull origin main

echo "==> Building new Docker image..."
docker build -t "$IMAGE_NAME" .

echo "==> Stopping and removing old container (if exists)..."
docker stop "$APP_NAME" 2>/dev/null || true
docker rm "$APP_NAME" 2>/dev/null || true

echo "==> Starting new container..."
docker run -d \
  --name "$APP_NAME" \
  --restart unless-stopped \
  # -p "$HOST_PORT:$CONTAINER_PORT" \
  "$IMAGE_NAME"

echo "==> Cleaning up dangling images..."
docker image prune -f

echo "==> Done! Container status:"
docker ps --filter "name=$APP_NAME"