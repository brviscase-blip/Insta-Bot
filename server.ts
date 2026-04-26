import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Example accounts
  app.get("/api/accounts", (req, res) => {
    res.json({ accounts: [] });
  });

  // Handle file uploads (Supabase will be used directly from client if possible, but keeping server option too)
  app.post("/api/media/upload", upload.single("file"), (req, res) => {
    // Media upload logic
    res.json({ success: true, message: "Upload pending implementation" });
  });

  // Scheduled posts api
  app.post("/api/scheduled-posts", (req, res) => {
    res.json({ success: true, post: { id: "mock" } });
  });

  app.get("/api/scheduled-posts", (req, res) => {
    res.json({ posts: [] });
  });

  // Webhook for Instagram (n8n will post here)
  app.post("/api/webhooks/instagram", (req, res) => {
    console.log("Received webhook:", req.body);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
