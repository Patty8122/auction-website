/**
 * Fetches data from the /test endpoint of the auction service.
 */
const getTest = async () => {
    try {
      const response = await fetch(`/api/auction/test`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.text();
    } catch (error) {
      throw error;
    }
  };
  
  export const auctionService = {
    getTest,
  };
  