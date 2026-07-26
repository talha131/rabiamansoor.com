# Rabia Mansoor — site tasks.
# Local development + production build. Netlify runs `make build`.

.DEFAULT_GOAL := help
.PHONY: help install dev build verify preview clean

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-9s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Run the local dev server
	npm run dev

build: ## Build the production site to dist/ (fails on a broken sitemap)
	npm run build && node scripts/verify-sitemap.mjs

verify: ## Verify the already-built dist/ sitemap
	node scripts/verify-sitemap.mjs

preview: ## Serve the production build locally
	npm run preview

clean: ## Remove build output
	rm -rf dist
