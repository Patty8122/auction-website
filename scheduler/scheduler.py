from datetime import datetime
import requests
import time

UI_SERVICE_URL = "http://ui-service:3001"

def main():
    while True:
        # Scheduler will check every minute and mark auctions as active or ended
        print("Scheduler is up !")
        time.sleep(30)
        
        try:
            url = f"{UI_SERVICE_URL}/auctions"
            response = requests.get(url)
            response.raise_for_status()
            
            current_time = datetime.utcnow()

            auctions_info = response.json()
            for auction in auctions_info:
                auction_id = auction.get('id')
                start_time_str = auction.get('start_time')
                end_time_str = auction.get('end_time')
                
                start_time = datetime.fromisoformat(start_time_str[:-1] if start_time_str.endswith('Z') else start_time_str)
                end_time = datetime.fromisoformat(end_time_str[:-1] if end_time_str.endswith('Z') else end_time_str)

                if start_time <= current_time <= end_time and auction.get('status') == 'pending':
                    # The auction is currently ongoing
                    url = f"{UI_SERVICE_URL}/start_auction/{auction_id}"
                    response = requests.post(url)
                    response.raise_for_status()
                    print(f"Auction {auction_id} has started.")

                elif current_time > end_time and auction.get('status') == 'active':
                    # The auction has ended
                    url = f"{UI_SERVICE_URL}/end_auction/{auction_id}"
                    response = requests.post(url)
                    response.raise_for_status()
                    print(f"Auction {auction_id} has ended.")

        except Exception as e:
            print(f"Error in scheduler: {e}")

        

if __name__ == "__main__":
    main()