// lib/apiHandler.js
import connectToDatabase from './mongodb';


export const withDatabase = (handler) => {
  return async (req, res) => {
    try {
    
      await connectToDatabase();

      
      return handler(req, res);
    } catch (error) {
      console.error('Error during database connection:', error);
      return res.status(500).json({ message: 'Database connection error' });
    }
  };
};
