#!/bin/sh

alembic -c app/migrations/alembic.ini upgrade "head"

PORT=3004

uvicorn app.main:app --host 0.0.0.0 --port $PORT

