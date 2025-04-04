ls -1 articles/*.html | jq -R . | jq -s . > blog-files.json
