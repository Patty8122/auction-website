# Use a base image with the necessary runtime for your consumer service
FROM python:3.8-slim

# install pika to access rabbitmq
RUN pip3 install pika

# Without this setting, Python never prints anything out.
ENV PYTHONUNBUFFERED=1

# declare the source directory
WORKDIR /usr/src/app/email_service

# copy the file
COPY email_service.py .

# Set the command to run your consumer service
CMD ["python3", "email_service.py"]
