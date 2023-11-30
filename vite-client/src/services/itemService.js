const API_BASE_URL = '/api/';

const getMyItems = async (currentUserId) => { 
  try {
    console.log(API_BASE_URL + 'items/seller/' + currentUserId)
    const response = await fetch(API_BASE_URL + 'items/seller/' + currentUserId)
    console.log(response)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

export const itemService = {
  getMyItems,
};