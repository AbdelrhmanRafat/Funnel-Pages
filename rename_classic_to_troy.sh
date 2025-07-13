#!/bin/bash

# === 1. Set your base path and theme name ===
THEMES_BASE="/Users/macbook/Desktop/Astro Test/FunelPage Test React/src/components/Themes"
THEME_NAME="Zen"
THEME_DIR="$THEMES_BASE/$THEME_NAME/${THEME_NAME}Theme"
THEME_SHORT="$THEME_NAME"  # In case you want different output name later

# === 2. Backup ===
BACKUP_BASE="/Users/macbook/Desktop/Astro/FunelPage/ClassicTo${THEME_SHORT}_backup_$(date +%Y%m%d_%H%M%S)"
echo "📦 Creating backup at: $BACKUP_BASE"
cp -r "$THEME_DIR" "$BACKUP_BASE"

# === 3. Replace file contents ===
echo "🔍 Replacing 'Classic' with '$THEME_SHORT' inside files..."
find "$THEME_DIR" -type f \( -name "*.astro" -o -name "*.css" -o -name "*.ts" -o -name "*.js" -o -name "*.json" -o -name "*.scss" -o -name "*.html" -o -name "*.tsx" -o -name "*.jsx" \) | while read file; do
  sed -i '' -E "
    s/\bclassic\b/$(echo "$THEME_SHORT" | tr '[:upper:]' '[:lower:]')/g;
    s/\bClassic\b/${THEME_SHORT}/g;
    s/\bCLASSIC\b/$(echo "$THEME_SHORT" | tr '[:lower:]' '[:upper:]')/g;

    s/classic([A-Z])/$(echo "$THEME_SHORT" | tr '[:upper:]' '[:lower:]')\1/g;
    s/Classic([A-Z])/${THEME_SHORT}\1/g;

    s/classic-/$(echo "$THEME_SHORT" | tr '[:upper:]' '[:lower:]')-/g;
    s/classic_/$(echo "$THEME_SHORT" | tr '[:upper:]' '[:lower:]')_/g;
    s/CLASSIC_/$(echo "$THEME_SHORT" | tr '[:lower:]' '[:upper:]')_/g;

    s/data\.classic\./data.$(echo "$THEME_SHORT" | tr '[:upper:]' '[:lower:]')./g;
  " "$file"
  echo "✅ Updated content: $file"
done

# === 4. Rename files ===
echo "🗂 Renaming files if needed..."
find "$THEME_DIR" -type f | while read file; do
  filename=$(basename "$file")
  dirname=$(dirname "$file")
  new_filename=$(echo "$filename" | sed -E "
    s/\bclassic\b/$(echo "$THEME_SHORT" | tr '[:upper:]' '[:lower:]')/g;
    s/\bClassic\b/${THEME_SHORT}/g;
    s/\bCLASSIC\b/$(echo "$THEME_SHORT" | tr '[:lower:]' '[:upper:]')/g;

    s/classic([A-Z])/$(echo "$THEME_SHORT" | tr '[:upper:]' '[:lower:]')\1/g;
    s/Classic([A-Z])/${THEME_SHORT}\1/g;

    s/classic-/$(echo "$THEME_SHORT" | tr '[:upper:]' '[:lower:]')-/g;
    s/classic_/$(echo "$THEME_SHORT" | tr '[:upper:]' '[:lower:]')_/g;
    s/CLASSIC_/$(echo "$THEME_SHORT" | tr '[:lower:]' '[:upper:]')_/g;
  ")
  
  new_file="$dirname/$new_filename"
  if [ "$file" != "$new_file" ]; then
    mv "$file" "$new_file"
    echo "📄 Renamed file: $file → $new_file"
  fi
done

# === 5. Rename directories ===
echo "📁 Renaming directories..."
find "$THEME_DIR" -depth -type d | sort -r | while read dir; do
  new_dir=$(echo "$dir" | sed -E "
    s/\bclassic\b/$(echo "$THEME_SHORT" | tr '[:upper:]' '[:lower:]')/g;
    s/\bClassic\b/${THEME_SHORT}/g;
    s/\bCLASSIC\b/$(echo "$THEME_SHORT" | tr '[:lower:]' '[:upper:]')/g;

    s/classic([A-Z])/$(echo "$THEME_SHORT" | tr '[:upper:]' '[:lower:]')\1/g;
    s/Classic([A-Z])/${THEME_SHORT}\1/g;

    s/classic-/$(echo "$THEME_SHORT" | tr '[:upper:]' '[:lower:]')-/g;
    s/classic_/$(echo "$THEME_SHORT" | tr '[:upper:]' '[:lower:]')_/g;
    s/CLASSIC_/$(echo "$THEME_SHORT" | tr '[:lower:]' '[:upper:]')_/g;
  ")
  if [ "$dir" != "$new_dir" ]; then
    mv "$dir" "$new_dir"
    echo "📂 Renamed directory: $dir → $new_dir"
  fi
done

echo "🚀 Done! All 'Classic' references changed to '$THEME_SHORT'"
echo "🗂 Backup saved to: $BACKUP_BASE"