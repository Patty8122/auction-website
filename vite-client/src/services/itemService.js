/**
 * Fetches data from the /test endpoint of the item service.
 */
const getTest = async () => {
    try {
      const response = await fetch(`/item/test`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      throw error;
    }
  };
  
  export const itemService = {
    getTest,
  };
  