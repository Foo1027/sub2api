SHELL := /bin/zsh

.PHONY: prepare up down restart logs ps config

prepare:
	./scripts/prepare.sh

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose down && docker compose up -d

logs:
	docker compose logs -f sub2api

ps:
	docker compose ps

config:
	docker compose config
