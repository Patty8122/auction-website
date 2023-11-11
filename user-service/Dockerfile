# Use an official Python runtime as a parent image
FROM python:3.10-slim-bullseye

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the content of the local src directory to the working directory
COPY ./app ./app

ENV PORT=3002

EXPOSE $PORT

# Specify the command to run on container start
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
