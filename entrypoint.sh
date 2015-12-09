#!/bin/bash
set -e

echo "Now running on environment [$ENV]"

if [ "$1" = 'migrate' ]; then
    echo 'Migrating Database...'
    NODE_ENV=$ENV npm run migrate
elif [ "$#" = '0' ]; then
    echo 'Running app...'
    NODE_ENV=$ENV npm run start
fi
