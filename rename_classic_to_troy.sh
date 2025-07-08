#!/bin/bash

# Set the base directory
BASE_DIR="/Users/macbook/Desktop/Astro/FunelPage/src/components/Themes/Troy/TroyTheme"

# Step 1: Create a backup of the directory
BACKUP_DIR="/Users/macbook/Desktop/Astro/FunelPage/ClassicToTroy_backup_$(date +%Y%m%d_%H%M%S)"
echo "📦 Creating backup at $BACKUP_DIR"
cp -r "$BASE_DIR" "$BACKUP_DIR"

# Step 2: Replace all case and naming style variants in file contents
echo "📝 Replacing all variants of 'classic' with 'troy' in file contents..."
find "$BASE_DIR" -type f \( -name "*.astro" -o -name "*.css" -o -name "*.ts" -o -name "*.js" -o -name "*.json" -o -name "*.scss" -o -name "*.html" \) | while read file; do
  sed -i '' -E '
    s/\bclassic\b/troy/g;                 # plain lowercase
    s/\bClassic\b/Troy/g;                 # Capitalized
    s/\bCLASSIC\b/TROY/g;                 # UPPERCASE

    s/classic([A-Z])/troy\1/g;            # camelCase
    s/Classic([A-Z])/Troy\1/g;            # PascalCase
    s/CLASSIC_([A-Z0-9_]+)/TROY_\1/g;     # UPPER_SNAKE_CASE

    s/classic-/troy-/g;                   # kebab-case
    s/classic_/troy_/g;                   # snake_case
    s/CLASSIC_/TROY_/g;                   # UPPER_SNAKE_CASE
    s/data\.classic\./data.troy./g;       # dot.case
  ' "$file"
  echo "✅ Updated: $file"
done

# Step 3: Rename files (preserving case variants)
echo "🗂 Renaming files..."
find "$BASE_DIR" -type f | while read file; do
  filename=$(basename "$file")
  dirname=$(dirname "$file")
  new_filename="$filename"

  new_filename=$(echo "$new_filename" | sed -E '
    s/\bclassic\b/troy/g;
    s/\bClassic\b/Troy/g;
    s/\bCLASSIC\b/TROY/g;

    s/classic([A-Z])/troy\1/g;
    s/Classic([A-Z])/Troy\1/g;
    s/CLASSIC_([A-Z0-9_]+)/TROY_\1/g;

    s/classic-/troy-/g;
    s/classic_/troy_/g;
    s/CLASSIC_/TROY_/g;
  ')

  new_file="$dirname/$new_filename"
  if [ "$file" != "$new_file" ]; then
    mv "$file" "$new_file"
    echo "📄 Renamed file: $file → $new_file"
  fi
done

# Step 4: Rename directories (preserving case variants, from deepest to shallowest)
echo "📁 Renaming directories..."
find "$BASE_DIR" -depth -type d | sort -r | while read dir; do
  new_dir="$dir"
  new_dir=$(echo "$new_dir" | sed -E '
    s/\bclassic\b/troy/g;
    s/\bClassic\b/Troy/g;
    s/\bCLASSIC\b/TROY/g;

    s/classic([A-Z])/troy\1/g;
    s/Classic([A-Z])/Troy\1/g;
    s/CLASSIC_([A-Z0-9_]+)/TROY_\1/g;

    s/classic-/troy-/g;
    s/classic_/troy_/g;
    s/CLASSIC_/TROY_/g;
  ')
  if [ "$dir" != "$new_dir" ]; then
    mv "$dir" "$new_dir"
    echo "📂 Renamed directory: $dir → $new_dir"
  fi
done

echo "🚀 All replacements from 'classic' to 'troy' are complete!"
echo "🗂 Backup created at: $BACKUP_DIR"