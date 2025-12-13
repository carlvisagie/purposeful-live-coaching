#!/bin/bash
# Test all pages for undefined variables and common errors

echo "=== SCANNING ALL FRONTEND PAGES FOR ERRORS ==="
echo ""

# Find undefined variable references (accessing properties without optional chaining)
echo "1. UNDEFINED VARIABLE REFERENCES:"
grep -rn "{\s*[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z]" client/src/pages/*.tsx | \
  grep -v "user\?" | grep -v "data\?" | grep -v "session\?" | \
  grep -v "import" | grep -v "//" | grep -v "trpc\." | \
  grep -v "console\." | grep -v "window\." | grep -v "process\." | \
  grep -v "Date\." | grep -v "Math\." | grep -v "JSON\." | \
  grep -v "Object\." | grep -v "Array\." | \
  head -20

echo ""
echo "2. MISSING VARIABLE DEFINITIONS:"
# Find variables used but not defined
for file in client/src/pages/*.tsx; do
  filename=$(basename "$file")
  # Look for variables used in JSX but not defined
  used_vars=$(grep -o "{[a-zA-Z_][a-zA-Z0-9_]*" "$file" | sed 's/{//' | sort -u)
  for var in $used_vars; do
    if ! grep -q "const $var\|let $var\|var $var\|function $var\|import.*$var" "$file" 2>/dev/null; then
      if [ "$var" != "user" ] && [ "$var" != "data" ] && [ "$var" != "session" ]; then
        echo "$filename: Potentially undefined variable: $var"
      fi
    fi
  done
done | head -20

echo ""
echo "3. MISSING OPTIONAL CHAINING:"
grep -rn "\.[a-zA-Z_][a-zA-Z0-9_]*\?" client/src/pages/*.tsx | \
  grep -v "user\?" | grep -v "data\?" | \
  wc -l

echo ""
echo "=== SCAN COMPLETE ==="
