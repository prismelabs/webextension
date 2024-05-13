.PHONY: lint
lint:
	npx standard .

.PHONY: lint/fix
lint/fix:
	npx standard --fix .
