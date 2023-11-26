/**
 * Fetches data from the /test endpoint of the user service.
 */
const getTest = async () => {
    try {
      const response = await fetch(`/api/login`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      throw error;
    }
  };
  
  export const userService = {
    getTest,
  };
  