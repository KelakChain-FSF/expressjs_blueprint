#!/bin/sh

# Set the PostgreSQL connection string from the environment variable
DATABASE_URL=$DATABASE_URL

# Timeout in seconds (20 seconds)
TIMEOUT=20
START_TIME=$(date +%s)

echo "Waiting for PostgreSQL to be ready..."

while true; do
  # Try to connect to PostgreSQL using `pg_isready`
  pg_isready -d $DATABASE_URL > /dev/null 2>&1

  # Check if the connection was successful
  if [ $? -eq 0 ]; then
    echo "PostgreSQL is ready!"
    break
  fi

  # Check if the timeout has been reached
  CURRENT_TIME=$(date +%s)
  ELAPSED_TIME=$((CURRENT_TIME - START_TIME))
  if [ $ELAPSED_TIME -ge $TIMEOUT ]; then
    echo "Timeout: PostgreSQL is not ready after $TIMEOUT seconds."
    exit 1
  fi

  # Wait for 1 second before retrying
  sleep 1
done

# Run the Prisma migration
echo "Running Prisma migrations..."
yarn prisma:migrate

# Start the application
echo "Starting the application..."
yarn dev