from flask import Flask, jsonify, request
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)

mongodb_host = 'mongodb_service'
mongodb_port = 27017
mongodb_db = 'log_db'
mongodb_user = 'root'
mongodb_password = 'example'

mongodb_client = MongoClient(mongodb_host, mongodb_port, username=mongodb_user, password=mongodb_password)
mongodb_db = mongodb_client[mongodb_db]
logs_collection = mongodb_db['logs']


@app.route('/logs', methods=['GET'])
def get_all_logs():
    logs = list(logs_collection.find({}, {'_id': 0}))

    # Convert ObjectId to str for JSON serialization
    for log in logs:
        log['timestamp'] = str(log['timestamp'])

    return jsonify(logs)


@app.route('/logs/service/<service_name>', methods=['GET'])
def get_logs_by_service(service_name):
    logs = list(logs_collection.find({'service_name': service_name}, {'_id': 0}))

    # Convert ObjectId to str for JSON serialization
    for log in logs:
        log['timestamp'] = str(log['timestamp'])

    return jsonify(logs)


@app.route('/logs/timestamp', methods=['GET'])
def get_logs_by_timestamp():
    start_timestamp = request.args.get('start_timestamp')
    end_timestamp = request.args.get('end_timestamp')

    # Convert timestamp strings to datetime objects
    start_datetime = datetime.strptime(start_timestamp, '%Y-%m-%d %H:%M:%S')
    end_datetime = datetime.strptime(end_timestamp, '%Y-%m-%d %H:%M:%S')

    # Retrieve logs within the specified timestamp range
    logs = list(logs_collection.find({
        'timestamp': {'$gte': start_datetime, '$lte': end_datetime}
    }, {'_id': 0}))

    # Convert ObjectId to str for JSON serialization
    for log in logs:
        log['timestamp'] = str(log['timestamp'])

    return jsonify(logs)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=2000)
