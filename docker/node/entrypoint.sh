#!/usr/bin/env bash

set -e

# Parse a Service Secret which is a JSON Key-Value and export them as environment variables
if [ -z "${SERVICE_SECRET:-}" ]; then
    echo "Skipping AWS Service Secret initialization"
else
    echo "Initializing environment variables from AWS Secrets Manager"

    for s in $(echo $SERVICE_SECRET | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" ); do
        export $s
    done
fi

exec "$@"