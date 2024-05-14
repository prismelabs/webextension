.PHONY: lint
lint:
	npx standard .

.PHONY: lint/fix
lint/fix:
	npx standard --fix .

.PHONY: zip
zip:
	zip -r -FS ../prisme-webext.zip \
		./popup ./content_scripts ./icons ./manifest.json \
		--exclude '*.git*'
