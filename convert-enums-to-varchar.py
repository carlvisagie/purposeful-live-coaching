#!/usr/bin/env python3
"""
Convert all pgEnum fields to varchar for PostgreSQL compatibility
This is the recommended approach for PostgreSQL schemas
"""

import re
from pathlib import Path

def convert_enums_to_varchar(content):
    """Convert pgEnum fields to varchar with appropriate length"""
    
    # Pattern: pgEnum("field_name", ["value1", "value2", ...])
    # Replace with: varchar("field_name", { length: 50 })
    
    def replace_enum(match):
        field_name = match.group(1)
        # Use length 50 for most enums (sufficient for status values)
        return f'varchar("{field_name}", {{ length: 50 }})'
    
    # Match pgEnum with any values
    content = re.sub(
        r'pgEnum\("([^"]+)",\s*\[[^\]]+\]\)',
        replace_enum,
        content
    )
    
    return content

def remove_pg_enum_import(content):
    """Remove pgEnum from imports since we're not using it anymore"""
    # Remove pgEnum from import list
    content = re.sub(
        r'(\bpgEnum\s*,\s*)',
        '',
        content
    )
    content = re.sub(
        r'(,\s*\bpgEnum\b)',
        '',
        content
    )
    return content

def main():
    """Convert all schema files"""
    drizzle_dir = Path('/home/ubuntu/purposeful-live-coaching/drizzle')
    
    converted = 0
    for schema_file in drizzle_dir.glob('*.ts'):
        if schema_file.name == 'relations.ts':
            continue
            
        content = schema_file.read_text()
        original = content
        
        # Convert enums to varchar
        content = convert_enums_to_varchar(content)
        
        # Remove pgEnum from imports
        content = remove_pg_enum_import(content)
        
        if content != original:
            schema_file.write_text(content)
            print(f"✅ Converted {schema_file.name}")
            converted += 1
        else:
            print(f"⏭️  {schema_file.name} (no enums)")
    
    print(f"\n{'='*50}")
    print(f"✅ Converted {converted} files")
    print(f"All enums → varchar (PostgreSQL best practice)")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()
