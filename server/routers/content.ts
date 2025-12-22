/**
 * Content API Router
 * Serves raw markdown content files (guides, lesson-notes, transcripts) through API
 * This allows React to fetch the raw markdown and render it beautifully
 */
import { Router } from "express";
import * as fs from "fs";
import * as path from "path";

export const contentRouter = Router();

// Base path for content files
const getContentBasePath = () => {
  // In production, the server runs from dist/server, and public files are in dist/public
  // In development, files are in client/public
  if (process.env.NODE_ENV === "production") {
    // From dist/server/routers, go up to dist, then into public
    return path.resolve(import.meta.dirname, "../public");
  }
  return path.resolve(import.meta.dirname, "../../client/public");
};

// Serve raw markdown content
contentRouter.get("/raw/:type/:filename", async (req, res) => {
  try {
    const { type, filename } = req.params;
    
    // Validate type
    const validTypes = ["guides", "lesson-notes", "transcripts", "assessments", "checklists", "ebooks", "templates"];
    if (!validTypes.includes(type)) {
      return res.status(404).json({ error: "Content type not found" });
    }
    
    // Construct file path
    const basePath = getContentBasePath();
    const filePath = path.join(basePath, type, filename);
    
    // Log for debugging
    console.log(`[Content API] Looking for file at: ${filePath}`);
    console.log(`[Content API] Base path: ${basePath}`);
    
    // Security check - prevent directory traversal
    if (!filePath.startsWith(basePath)) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`[Content API] File not found: ${filePath}`);
      return res.status(404).json({ error: "Content not found" });
    }
    
    // Read and return the raw markdown
    const content = fs.readFileSync(filePath, "utf-8");
    res.type("text/plain").send(content);
  } catch (error) {
    console.error("[Content API] Error:", error);
    res.status(500).json({ error: "Failed to load content" });
  }
});
