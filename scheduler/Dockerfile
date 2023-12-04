# Use a base image with the necessary runtime for your consumer service
FROM python:3.8-slim

# Without this setting, Python never prints anything out.
ENV PYTHONUNBUFFERED=1

# declare the source directory
WORKDIR /usr/src/app/scheduler

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# copy the file
COPY scheduler.py .

# Set the command to run your consumer service
CMD ["python3", "scheduler.py"]
