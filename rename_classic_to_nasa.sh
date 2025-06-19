#!/bin/bash

# Set the base directory
BASE_DIR="/Users/macbook/Desktop/Astro/FunelPage/src/components/Themes/Nasa/NasaTheme"

# Step 1: Create a backup of the directory
BACKUP_DIR="/Users/macbook/Desktop/Astro/FunelPage/NasaTheme_backup_$(date +%Y%m%d_%H%M%S)"
echo "📦 Creating backup at $BACKUP_DIR"
cp -r "$BASE_DIR" "$BACKUP_DIR"

# Step 2: Replace content in files (case-insensitive)
echo "📝 Replacing all case-insensitive instances of 'classic' with 'nasa' in file contents..."
find "$BASE_DIR" -type f \( -name "*.astro" -o -name "*.css" -o -name "*.ts" -o -name "*.js" -o -name "*.json" -o -name "*.scss" -o -name "*.html" \) | while read file; do
  sed -i '' -E '
    s/classic/nasa/gI;
    s/Classic/Nasa/gI;
    s/CLASSIC/NASA/gI;
  ' "$file"
  echo "✅ Updated: $file"
done

# Step 3: Rename files (case-insensitive)
echo "🗂 Renaming files..."
find "$BASE_DIR" -type f | while read file; do
  filename=$(basename "$file")
  dirname=$(dirname "$file")
  new_filename=$(echo "$filename" | sed -E 's/[Cc][Ll][Aa][Ss][Ss][Ii][Cc]/Nasa/g')
  new_file="$dirname/$new_filename"
  if [ "$file" != "$new_file" ]; then
    mv "$file" "$new_file"
    echo "📄 Renamed file: $file → $new_file"
  fi
done

# Step 4: Rename directories (case-insensitive, from deepest to shallowest)
echo "📁 Renaming directories..."
find "$BASE_DIR" -depth -type d -iname "*classic*" | sort -r | while read dir; do
  new_dir=$(echo "$dir" | sed -E 's/[Cc][Ll][Aa][Ss][Ss][Ii][Cc]/Nasa/g')
  if [ "$dir" != "$new_dir" ]; then
    mv "$dir" "$new_dir"
    echo "📂 Renamed directory: $dir → $new_dir"
  fi
done

echo "🎉 Renaming complete! Please verify the results in: $BASE_DIR"
