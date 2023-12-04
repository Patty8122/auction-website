import React from 'react';
import { DropdownItem } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';




export const Form = ({ onSubmit, placeholders }) => {
  if (!placeholders) {
    placeholders = {
      title: 'Title',
      category_id: 'Category Id',
      shipping_cost: 'Shipping Cost',
      quantity: '1',
      initial_bid_price: 'Initial Bid Price',
      photo_url1: 'Image URL',
    };
  }
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="name">Title</label>
        <input className="form-control" id="title" placeholder={placeholders.title} />
      </div>
      <div className="form-group">
        <label htmlFor="name">Category Id</label>
        <input className="form-control" id="category_id" placeholder={placeholders.category_id} />
      </div>
      <div className="form-group">
        <label htmlFor="name">Shipping Cost</label>
        <input className="form-control" id="shipping_cost" placeholder={placeholders.shipping_cost} />
      </div>
      <div className="form-group">
        <label htmlFor="name">Quantity</label>
        <input className="form-control" id="quantity" placeholder={placeholders.quantity} />
      </div>
      <div className="form-group">
        <label htmlFor="name">Initial Bid Price</label>
        <input className="form-control" id="initial_bid_price" placeholder={placeholders.initial_bid_price} />
      </div>
      <div className="form-group">
        <label htmlFor="name">Image URL</label>
        <input className="form-control" id="photo_url1" placeholder={placeholders.photo_url1} />
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
