import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

const app = express();
const PORT = 3001;

app.use(cors());

// folder to store images
const uploadDir = path.join(__dirname, "../uploads/job-post-images");
fs.mkdirSync(uploadDir, { recursive: true });

// multer config
const upload = multer({ storage: multer.memoryStorage() });

// upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image provided" });
  }

  const ext = path.extname(req.file.originalname);
  const fileName = `${uuid()}${ext}`;
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, req.file.buffer);

  res.json({
    imageUrl: `http://localhost:${PORT}/uploads/job-post-images/${fileName}`
  });
});

// serve images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.listen(PORT, () => {
  console.log(`Upload server running on http://localhost:${PORT}`);
});
