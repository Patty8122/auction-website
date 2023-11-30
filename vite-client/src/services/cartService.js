const API_URL = '/api';


const createCart = async (user_id) => {
      try {
        const response = await fetch(`${API_URL}/create_cart/${user_id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (!response.ok) {
          throw new Error('Cart creation failed');
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
};
  
const   addItemToCart = async (cart_id, item_id, quantity) => {
      try {
        const response = await fetch(`${API_URL}/add_item_to_cart/${cart_id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item_id, quantity }),
        });
  
        if (!response.ok) {
          throw new Error('Adding item to cart failed');
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
};
  
const getCartItems = async (cart_id) => {
      try {
        const response = await fetch(`${API_URL}/get_cart_items/${cart_id}`);
  
        if (!response.ok) {
          throw new Error('Fetching cart items failed');
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
};

const removeItemFromCart = async (user_id, item_id) => {
      try {
        const response = await fetch(`${API_URL}/remove_item_from_cart/${user_id}/${item_id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error('Removing item from cart failed');
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
};

export const cartService = {
    createCart,
    addItemToCart,
    getCartItems,
    removeItemFromCart
    
    };