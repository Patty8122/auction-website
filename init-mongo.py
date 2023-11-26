from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://root:example@mongodb:27017/')
db = client['log_db']

# Create 'logs' collection
db.create_collection('logs')

# Insert a document into 'logs' collection
db.logs.insert_one({
    'message': 'Hello, this is a sample log entry',
    'timestamp': '2023-11-25T12:00:00Z'  # Replace with the actual timestamp
})
