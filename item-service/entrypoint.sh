#!/bin/sh

alembic -c app/migrations/alembic.ini upgrade '66a49d3eb3d5'
alembic -c app/migrations/alembic.ini upgrade '5c680a467d9f'

PORT=3004

uvicorn app.main:app --host 0.0.0.0 --port $PORT

