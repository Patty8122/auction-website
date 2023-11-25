import pika
import json
import os

# Connect to RabbitMQ
amqp_url = os.environ['AMQP_URL']
url_params = pika.URLParameters(amqp_url)

# connect to rabbitmq
connection = pika.BlockingConnection(url_params)
channel = connection.channel()

# Declare the queue
channel.queue_declare(queue='logs_service_queue', durable=True)

# Sample log data
log_data = {
    'timestamp': '2023-11-24T12:00:00',
    'service_name': 'test_service',
    'log_type': 'INFO',
    'message': 'This is a sample log message',
}

# Publish the log message to the queue
channel.basic_publish(
    exchange='',
    routing_key='logs_service_queue',
    body=json.dumps(log_data),
    properties=pika.BasicProperties(
        delivery_mode=2,  # Make the message persistent
    )
)

print(" [x] Sent log message")

# Close the connection
connection.close()
