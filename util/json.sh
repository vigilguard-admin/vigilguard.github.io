articles/*.html | jq -R . | jq -s . > blog-files.json
