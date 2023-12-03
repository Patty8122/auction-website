import React from 'react';

// created_at: str = str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
// updated_at: str = str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
// quantity: Optional[int] = 1
// description: Optional[str] = 'No description provided'
// shipping_cost: Optional[float] = 0.0
// category_id: int
// initial_bid_price: float
// final_bid_price: Optional[float] = None
// seller_id: Optional[int] = None
// buyer_id: Optional[int] = None
// photo_url1: Optional[str] = None
// photo_url2: Optional[str] = None
// photo_url3: Optional[str] = None
// photo_url4: Optional[str] = None
// photo_url5: Optional[str] = None

export const Form = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="name">Title</label>
        <input className="form-control" id="description" />
      </div>
      <div className="form-group">
        <label htmlFor="name">Category</label>
        <input className="form-control" id="category" />
      </div>
      <div className="form-group">
        <label htmlFor="name">Shipping Cost</label>
        <input className="form-control" id="shipping_cost" />
      </div>
      <div className="form-group">
        <label htmlFor="name">Quantity</label>
        <input className="form-control" id="quantity" placeholder='1'/>
      </div>
      <div className="form-group">
        <label htmlFor="name">Initial Bid Price</label>
        <input className="form-control" id="initial_bid_price" />
      </div>
      <div className="form-group">
        <button className="form-control btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};
export default Form;
