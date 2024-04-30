import { itemService } from './itemService';

const API_BASE_URL = '/api/auctions';

const getAuctions = async (options = {}) => {
  try {
    const queryParams = new URLSearchParams(options).toString();
    const url = queryParams ? `${API_BASE_URL}?${queryParams}` : API_BASE_URL;
    console.log("url", url);

    const response = await fetch(url);
    if (!response.ok) {
      console.log("response", response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching auctions:', error);
    throw error;
  }
};

const createAuction = async (auctionData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auctionData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating auction:', error);
    throw error;
  }
};

const getAuctionById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching auction with id ${id}:`, error);
    throw error;
  }
};

const setAuctionStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "status": status })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.message === 'Auction status updated successfully') {
      return { success: true, data };
    } else {
      return { success: false, error: 'Update was not successful' };
    }

  } catch (error) {
    console.error(`Error updating status for auction with id ${id}:`, error);
    throw new Error(`Error updating auction status: ${error.message}`);
  }
};

const endAuction = async (id) => {
  try {
    const response = await fetch(`/api/end_auction/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error ending auction with id ${id}:`, error);
    throw error;
  }
};


const getAuctionsByUserId = async (userId) => {
  try {
    const response = await fetch(`/api/users/${userId}/auctions`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching auctions for user ${userId}:`, error);
    throw error;
  }
}

const placeBid = async (auctionId, bidData) => {
  console.log("body", JSON.stringify(bidData));
  
  try {
    const response = await fetch(`${API_BASE_URL}/${auctionId}/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bidData),
    });


    if (!response.ok) {
      console.log("response", response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error placing bid on auction ${auctionId}:`, error);
    throw error;
  }
};

const getBids = async (auctionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${auctionId}/bids`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching bids for auction ${auctionId}:`, error);
    throw error;
  }
};

const getCurrentBid = async (auctionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${auctionId}/current-bid`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching current bid for auction ${auctionId}:`, error);
    throw error;
  }
};

const getFinalBid = async (auctionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${auctionId}/final-bid`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching final bid for auction ${auctionId}:`, error);
    throw error;
  }
};

// This function takes an array of auctions and returns a new array of auctions
// with enriched data from the items and categories tables.
const enrichAuctions = async (auctions) => {
  const itemIds = [...new Set(auctions.map(a => a.item_id))];
  const items = await Promise.all(itemIds.map(itemId => itemService.getItemById(itemId)));
  const itemsMap = items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});

  const categoryIds = [...new Set(items.map(item => item.category_id))];
  const categories = await Promise.all(categoryIds.map(categoryId => itemService.getCategoryName(categoryId)));
  const categoriesMap = categories.reduce((acc, category) => ({ ...acc, [category.id]: category }), {});

  return auctions.map(auction => ({
    ...auction,
    item_title: itemsMap[auction.item_id]?.title,
    category: categoriesMap[itemsMap[auction.item_id]?.category_id]?.category,
    photo_url1: itemsMap[auction.item_id]?.photo_url1,
    shipping_cost: itemsMap[auction.item_id]?.shipping_cost,
    quantity: itemsMap[auction.item_id]?.quantity
  }));
};

export const auctionService = {
  getAuctions,
  createAuction,
  getAuctionById,
  getAuctionsByUserId,
  placeBid,
  getBids,
  getCurrentBid,
  getFinalBid,
  enrichAuctions,
  setAuctionStatus,
  endAuction,
};