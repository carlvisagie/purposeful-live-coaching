#!/usr/bin/env python3
"""
Fix all missing PostgreSQL imports in schema files
"""

import re
from pathlib import Path

def fix_imports(filepath):
    """Add missing pg-core imports to a schema file"""
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Find the pg-core import line
    import_match = re.search(r'import \{([^}]+)\} from "drizzle-orm/pg-core"', content)
    if not import_match:
        return False
    
    current_imports = set(i.strip() for i in import_match.group(1).split(','))
    
    # Find all pg-core functions used in the file
    used_functions = set()
    
    # Common PostgreSQL types and functions
    pg_functions = [
        'pgTable', 'pgEnum', 'serial', 'integer', 'varchar', 'text', 
        'timestamp', 'boolean', 'json', 'jsonb', 'uuid', 'date',
        'real', 'doublePrecision', 'numeric', 'bigint', 'smallint',
        'char', 'time', 'interval', 'bytea', 'inet', 'cidr', 'macaddr',
        'point', 'line', 'lseg', 'box', 'path', 'polygon', 'circle'
    ]
    
    for func in pg_functions:
        # Check if function is used but not imported
        if re.search(rf'\b{func}\s*\(', content) and func not in current_imports:
            used_functions.add(func)
    
    if not used_functions:
        return False
    
    # Add missing imports
    all_imports = sorted(current_imports | used_functions)
    new_import_line = f'import {{ {", ".join(all_imports)} }} from "drizzle-orm/pg-core"'
    
    content = re.sub(
        r'import \{[^}]+\} from "drizzle-orm/pg-core"',
        new_import_line,
        content
    )
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    return True

def main():
    """Fix all schema files"""
    drizzle_dir = Path('/home/ubuntu/purposeful-live-coaching/drizzle')
    
    fixed = 0
    for schema_file in drizzle_dir.glob('*.ts'):
        if fix_imports(schema_file):
            print(f"✅ Fixed {schema_file.name}")
            fixed += 1
        else:
            print(f"⏭️  {schema_file.name} (no changes needed)")
    
    print(f"\n{'='*50}")
    print(f"Fixed {fixed} files")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()
