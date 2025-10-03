#!/usr/bin/env python3
"""
Script to remove all 'id' fields from the exam-structure.json file
"""
import json
import sys

def remove_id_fields(obj):
    """Recursively remove 'id' fields from a JSON object"""
    if isinstance(obj, dict):
        # Remove 'id' field if it exists
        if 'id' in obj:
            del obj['id']
        # Recursively process all values
        for key, value in obj.items():
            remove_id_fields(value)
    elif isinstance(obj, list):
        # Recursively process all items in list
        for item in obj:
            remove_id_fields(item)

def main():
    try:
        # Read the JSON file
        with open('data/exam-structure.json', 'r') as f:
            data = json.load(f)

        # Remove all ID fields
        remove_id_fields(data)

        # Write back to file with proper formatting
        with open('data/exam-structure.json', 'w') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print("✅ Successfully removed all 'id' fields from exam-structure.json")

    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
