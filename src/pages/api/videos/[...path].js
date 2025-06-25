import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { path: videoPath } = req.query;
    
    if (!videoPath || !Array.isArray(videoPath)) {
      return res.status(400).json({ error: 'Invalid video path' });
    }

    // Reconstruct the full path from the array
    const relativePath = videoPath.join('/');
    console.log('Requested video path:', relativePath);
    
    // Your AdminJS server URL (adjust port and host as needed)
    const adminJSBaseUrl = process.env.ADMINJS_URL || 'http://localhost:8000'; // or whatever port your AdminJS runs on
    const videoUrl = `${adminJSBaseUrl}/uploads/${relativePath}`;
    
    console.log('Fetching video from AdminJS:', videoUrl);

    // Handle range requests for video streaming
    const headers = {};
    if (req.headers.range) {
      headers.Range = req.headers.range;
    }

    try {
      const response = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'stream',
        headers,
        validateStatus: (status) => status < 400 || status === 206, // Accept 206 for partial content
      });

      // Forward the response headers from AdminJS
      Object.keys(response.headers).forEach(key => {
        if (key.toLowerCase().startsWith('content-') || 
            key.toLowerCase().startsWith('accept-') ||
            key.toLowerCase() === 'cache-control') {
          res.setHeader(key, response.headers[key]);
        }
      });

      // Set the appropriate status code
      res.status(response.status);
      
      // Pipe the video stream from AdminJS to the client
      response.data.pipe(res);

    } catch (proxyError) {
      console.error('Error fetching video from AdminJS:', proxyError.message);
      
      if (proxyError.response?.status === 404) {
        return res.status(404).json({ 
          error: 'Video not found on AdminJS server',
          videoUrl: videoUrl 
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to fetch video from AdminJS server',
        details: process.env.NODE_ENV === 'development' ? proxyError.message : undefined
      });
    }

  } catch (error) {
    console.error('Error in video proxy:', error);
    res.status(500).json({ 
      error: 'Failed to serve video',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Important: Disable body parsing for video files
export const config = {
  api: {
    responseLimit: false,
  },
}