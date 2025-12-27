import express from "express";
import fetch from "node-fetch";

export const videoProxyRouter = express.Router();

// Proxy video requests to Manus CDN with proper CORS headers
videoProxyRouter.get("/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    
    // Construct the Manus CDN URL
    const videoUrl = `https://files.manuscdn.com/user_upload_by_module/session_file/310419663029732906/${videoId}.mp4`;
    
    console.log(`[VideoProxy] Proxying video: ${videoId}`);
    
    // Fetch the video from Manus CDN
    const response = await fetch(videoUrl);
    
    if (!response.ok) {
      console.error(`[VideoProxy] Failed to fetch video: ${response.status} ${response.statusText}`);
      return res.status(response.status).send("Video not found");
    }
    
    // Set proper headers for video streaming with CORS
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Range");
    res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
    
    // Get content length if available
    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }
    
    // Handle range requests for video seeking
    const range = req.headers.range;
    if (range && contentLength) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : parseInt(contentLength) - 1;
      const chunksize = (end - start) + 1;
      
      res.status(206);
      res.setHeader("Content-Range", `bytes ${start}-${end}/${contentLength}`);
      res.setHeader("Content-Length", chunksize.toString());
    }
    
    // Stream the video
    if (response.body) {
      response.body.pipe(res);
    } else {
      res.status(500).send("Failed to stream video");
    }
    
  } catch (error) {
    console.error("[VideoProxy] Error proxying video:", error);
    res.status(500).send("Internal server error");
  }
});

// Handle OPTIONS requests for CORS preflight
videoProxyRouter.options("/:videoId", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Range");
  res.status(200).end();
});
