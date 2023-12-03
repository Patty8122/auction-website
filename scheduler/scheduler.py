import time

UI_SERVICE_URL = "http://ui-service:3001"

def main():
    while True:
        # Get all auctions data
        
        # Filter auctions that are PENDING and past start time
        
        # Call mediator to START those AUCTIONs

        # Filter auctions that are STARTED and past end time
        print("Scheduler is up !")
        # Call mediator to END those AUCTIONs

        # Sleep for 1 minute before polling the API again
        time.sleep(60)

if __name__ == "__main__":
    main()