import React from 'react';

export const AuctionForm = ({ onSubmit, placeholders }) => {
  if (!placeholders) {
    placeholders = {
        itemid: 'Item Id',
        startDateTime: 'Start Date Time',
        endDateTime: 'End Date Time',
        startingPrice: 'Starting Price',
        sellerId: 'Seller Id',
        bidIncrement: 'Bid Increment',
    };
  }



  return (
    <form onSubmit={onSubmit}>
        <div className="form-group">
            <label htmlFor="name">Item Id</label>
            <input className="form-control" id="itemid" placeholder={placeholders.itemid} />
        </div>
        <div className="form-group">
            <label htmlFor="name">Start Date Time</label>
            <input type="datetime-local" className="form-control" id="startDateTime" />
        </div>
        <div className="form-group">
            <label htmlFor="name">End Date Time</label>
            <input type="datetime-local" className="form-control" id="endDateTime" />
        </div>
        <div className="form-group">
            <label htmlFor="name">Starting Price</label>
            <input className="form-control" id="startingPrice" placeholder={placeholders.startingPrice} />
        </div>
        <div className="form-group">
            <label htmlFor="name">Seller Id</label>
            <input className="form-control" id="sellerId" placeholder={placeholders.sellerId} />
        </div>
        <div className="form-group">
            <label htmlFor="name">Bid Increment</label>
            <input className="form-control" id="bidIncrement" placeholder={placeholders.bidIncrement} />
        </div>
        <div className="form-group">
        <button className="form-control btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};
export default AuctionForm;
