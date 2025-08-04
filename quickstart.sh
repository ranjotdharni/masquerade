#!/bin/bash

echo "Starting server..."
npm run server &

echo "Starting frontend..."
npm run ui &
