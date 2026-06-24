.PHONY: up down build logs restart clean

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose up -d --build

logs:
	docker compose logs -f

restart:
	docker compose restart

clean:
	docker compose down -v
