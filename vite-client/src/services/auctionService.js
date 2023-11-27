const API_BASE_URL = '/api/auctions';

const getAuctions = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
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
  try {
    const response = await fetch(`${API_BASE_URL}/${auctionId}/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bidData),
    });
    if (!response.ok) {
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

export const auctionService = {
  getAuctions,
  createAuction,
  getAuctionById,
  getAuctionsByUserId,
  placeBid,
  getBids,
  getCurrentBid,
  getFinalBid,
};