import json
import os
import pika
import smtplib
from email.mime.text import MIMEText
from pymongo import MongoClient


mongodb_host = os.environ.get('MONGODB_HOST')
mongodb_port = int(os.environ.get('MONGODB_PORT', 27017))
mongodb_db = 'log_db'
mongodb_user = 'root'
mongodb_password = 'example'

mongodb_client = MongoClient(mongodb_host, mongodb_port, username=mongodb_user, password=mongodb_password)
mongodb_db = mongodb_client[mongodb_db]
logs_collection = mongodb_db['logs']


def publish_log(log_content):
    # push the log content to mongodb
    print("Publishing log to mongodb")

    logs_collection.insert_one({
          'timestamp': log_content['timestamp'],
          'service_name': log_content['service_name'],
          'log_type': log_content['log_type'],
          'message': log_content['message'],
	})

    print("Log published to mongodb")


def callback(ch, method, properties, body):
    
    print("Starting processing")

    # parse the message body which is a JSON string
    log_content = json.loads(body.decode('utf-8'))
    
    print(f"Log content is: {log_content}")

    # send_email(email_content['from_address'], email_content['to_address'], email_content['subject'],
    #            email_content['body'], 'FROM_EMAIL', 'APP_PASSWORD')

	# publish the log content to mongodb
    publish_log(log_content)

    # Acknowledge message receipt
    ch.basic_ack(delivery_tag=method.delivery_tag)
    

if __name__ == '__main__':
    # RabbitMQ configuration
    # Reference: https://github.com/deepshig/rabbitmq-docker
    # read rabbitmq connection url from environment variable
    amqp_url = os.environ['AMQP_URL']
    url_params = pika.URLParameters(amqp_url)

    # connect to rabbitmq
    connection = pika.BlockingConnection(url_params)
    channel = connection.channel()

    # declare a new queue
    # durable flag is set so that messages are retained
    # in the rabbitmq volume even between restarts
    channel.queue_declare(queue='logs_service_queue', durable=True)
    
    # to make sure the consumer receives only one message at a time
    # next message is received only after acking the previous one
    channel.basic_qos(prefetch_count=1)

    # define the queue consumption
    channel.basic_consume(queue='logs_service_queue',
                       on_message_callback=callback)

    print("Waiting to consume")
    # start consuming
    channel.start_consuming()
