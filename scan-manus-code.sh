#!/bin/bash

echo "# MANUS CODE SCAN RESULTS" > MANUS_CODE_SCAN.md
echo "" >> MANUS_CODE_SCAN.md
echo "**Date:** $(date)" >> MANUS_CODE_SCAN.md
echo "" >> MANUS_CODE_SCAN.md

echo "## Searching for Manus imports/dependencies..." >> MANUS_CODE_SCAN.md
echo "" >> MANUS_CODE_SCAN.md
grep -r "from.*manus\|import.*manus\|@manus" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . 2>/dev/null | grep -v node_modules | head -20 >> MANUS_CODE_SCAN.md
echo "" >> MANUS_CODE_SCAN.md

echo "## Checking package.json for manus dependencies..." >> MANUS_CODE_SCAN.md
echo "" >> MANUS_CODE_SCAN.md
grep -i "manus" package.json 2>/dev/null >> MANUS_CODE_SCAN.md
echo "" >> MANUS_CODE_SCAN.md

echo "## Checking for manus in environment/config files..." >> MANUS_CODE_SCAN.md
echo "" >> MANUS_CODE_SCAN.md
grep -r "manus" --include=".env*" --include="*.config.*" --include="*.json" . 2>/dev/null | grep -v node_modules | head -20 >> MANUS_CODE_SCAN.md
echo "" >> MANUS_CODE_SCAN.md

echo "## Checking for manus command-line utilities..." >> MANUS_CODE_SCAN.md
echo "" >> MANUS_CODE_SCAN.md
grep -r "manus-" --include="*.ts" --include="*.js" --include="*.sh" . 2>/dev/null | grep -v node_modules | head -20 >> MANUS_CODE_SCAN.md

echo "Scan complete!"
