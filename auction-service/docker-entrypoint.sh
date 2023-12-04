#!/bin/bash
set -e

# Run migrations
# npm run migrate:down
npm run migrate

# Populate test data
npm run test-data

# Start the service
npm run start
