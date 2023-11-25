FROM python:3.8

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install Flask

COPY logging_service.py /app/logging_service.py
COPY logs_api.py /app/app.py

ENV PYTHONUNBUFFERED=1

CMD ["sh", "-c", "python3 logging_service.py & flask run --host=0.0.0.0 --port=2000"]
