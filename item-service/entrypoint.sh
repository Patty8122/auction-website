#!/bin/sh

alembic -c app/migrations/alembic.ini upgrade '66a49d3eb3d5'
alembic -c app/migrations/alembic.ini upgrade '5c680a467d9f'
