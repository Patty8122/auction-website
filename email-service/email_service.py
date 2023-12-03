import json
import os
import pika
import smtplib
from email.mime.text import MIMEText

def send_email(from_address, to_address, subject, body, gmail_username, app_password):
    # Set up the email content
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = from_address
    msg['To'] = to_address

    # Connect to Gmail's SMTP server
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        # Start TLS for security
        server.starttls()

        # Login with Gmail credentials using the App Password
        server.login(gmail_username, app_password)

        # Send the email
        server.sendmail(msg['From'], [msg['To']], msg.as_string())
        

def callback(ch, method, properties, body):
    # parse the message body which is a JSON string
    
    try:
        email_content = json.loads(body.decode('utf-8'))
        
        print(f"Email content is: {email_content}")

        send_email(email_content['from_address'], email_content['to_address'], email_content['subject'],
                   email_content['body'], 'teambitmasters@gmail.com', 'gwwi thar jywl tdci')

        # Acknowledge message receipt
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(f"Email could not be sent: Error: {e}")

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
    channel.queue_declare(queue='email_service_queue', durable=True)
    
    # to make sure the consumer receives only one message at a time
    # next message is received only after acking the previous one
    channel.basic_qos(prefetch_count=1)

    # define the queue consumption
    channel.basic_consume(queue='email_service_queue',
                       on_message_callback=callback)

    print("Waiting to consume")
    # start consuming
    channel.start_consuming()
