#!/usr/bin/env python3
"""
Automated MySQL to PostgreSQL schema conversion script
Converts all Drizzle schema files from MySQL syntax to PostgreSQL syntax
"""

import os
import re
from pathlib import Path

def convert_file(filepath):
    """Convert a single schema file from MySQL to PostgreSQL"""
    with open(filepath, 'r') as f:
        content = f.read()
    
    original_content = content
    
    # Import replacements
    content = content.replace('from "drizzle-orm/mysql-core"', 'from "drizzle-orm/pg-core"')
    content = content.replace("from 'drizzle-orm/mysql-core'", "from 'drizzle-orm/pg-core'")
    
    # Table and enum replacements
    content = content.replace('mysqlTable', 'pgTable')
    content = content.replace('mysqlEnum', 'pgEnum')
    
    # Data type replacements
    content = re.sub(r'\bint\(', 'integer(', content)
    content = re.sub(r'\.autoincrement\(\)', '.generatedAlwaysAsIdentity()', content)
    content = content.replace('datetime(', 'timestamp(')
    
    # Serial types (common pattern: int().autoincrement().primaryKey())
    content = re.sub(
        r'integer\("(\w+)"\)\.generatedAlwaysAsIdentity\(\)\.primaryKey\(\)',
        r'serial("\1").primaryKey()',
        content
    )
    
    # Only write if changes were made
    if content != original_content:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

def main():
    """Convert all schema files in drizzle directory"""
    drizzle_dir = Path('/home/ubuntu/purposeful-live-coaching/drizzle')
    
    converted = 0
    skipped = 0
    
    for schema_file in drizzle_dir.glob('*.ts'):
        if schema_file.name in ['index.ts', 'migrations']:
            continue
            
        print(f"Converting {schema_file.name}...", end=' ')
        
        if convert_file(schema_file):
            print("✅")
            converted += 1
        else:
            print("⏭️  (no changes needed)")
            skipped += 1
    
    print(f"\n{'='*50}")
    print(f"Conversion complete!")
    print(f"✅ Converted: {converted} files")
    print(f"⏭️  Skipped: {skipped} files")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()
