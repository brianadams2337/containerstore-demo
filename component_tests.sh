#!/bin/bash

# Define the root directory and target test directory
SRC_DIR="components"
TEST_DIR="tests/unit/components"

# Navigate through each .vue file and create or modify a .test.ts file for it in the test directory
find $SRC_DIR -type f -name "*.vue" | while read vue_file; do
    # Get the relative path
    relative_path="${vue_file#$SRC_DIR/}"

    # Replace .vue with .test.ts and prepend the target test directory
    test_file="$TEST_DIR/${relative_path%.vue}.test.ts"
    
    # Get the base filename without extension for the describe block
    base_filename="$(basename "${relative_path%.vue}")"

    # Create the directory structure for the test file
    mkdir -p "$(dirname "$test_file")"

    # Check if the test file already exists
    if [ ! -f "$test_file" ]; then
        touch "$test_file"
        echo "Created test file: $test_file"
    fi

    # Write the specified content to the file
    echo "import { describe, test, expect } from 'vitest'

describe('<$base_filename />', () => {
  // TODO: Remove this demo test 
  test('Demo test', () => {
    expect(true).toEqual(true)
  })
})
" > "$test_file"

done
