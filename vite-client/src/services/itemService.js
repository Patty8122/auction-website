const API_BASE_URL = '/api/';

const getItemsByUserId = async (currentUserId) => { 
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

const getCategories = async () => { 
  try {
    const response = await fetch(`${API_BASE_URL}categories`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const createCategory = async (categoryName) => {
  try {
    const response = await fetch(`${API_BASE_URL}category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category: categoryName }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

<<<<<<< Updated upstream
export const itemService = {
  getMyItems,
  getCategories,
  createCategory,
=======
const getItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}items`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}

const createItem = async (item, currentUserId) => {
  try {
    if (!currentUserId) {
      throw new Error('currentUserId is required');
    }

    const response = await fetch(API_BASE_URL + 'items?user_id=' + currentUserId.user_id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),

    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }

}


const getCategories = async () => { 
  try {
    const response = await fetch(`${API_BASE_URL}categories`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const createCategory = async (categoryName) => {
  try {
    const response = await fetch(`${API_BASE_URL}category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category: categoryName }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

const getCategoryName = async (categoryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}category/${categoryId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
}

const searchItems = async (searchTerm) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search/${searchTerm}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching items:', error);
    throw error;
  }
}

const removeItem = async (itemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}items?item_id=${itemId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}

const editItem = async (item, itemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}items_edit/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error editing item:', error);
    throw error;
  }
}

export const itemService = {
  getItemsByUserId,
  getCategories,
  createCategory,
  getCategoryName,
  createItem,
  searchItems,
  removeItem,
  editItem
>>>>>>> Stashed changes
};