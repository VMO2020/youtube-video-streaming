require("dotenv").config();
const express = require("express");
const { spawn } = require("child_process");
const http = require("http");
const socketIo = require("socket.io");
const multer = require("multer");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;
const YOUTUBE_RTMP_URL = `rtmp://a.rtmp.youtube.com/live2/${process.env.YOUTUBE_STREAM_KEY}`;

app.use(express.static("public")); // Serve frontend files

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, "video.mp4"); // Always save as video.mp4 to simplify streaming
  },
});
const upload = multer({ storage });

let ffmpegProcess = null;
let isStreaming = false;

// Handle file uploads
app.post("/upload", upload.single("videoFile"), (req, res) => {
  console.log("File uploaded successfully.");
  res.json({ message: "File uploaded successfully." });
});

// Handle stream start
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("start-stream", () => {
    if (isStreaming) {
      socket.emit("stream-status", { status: "Already Streaming" });
      return;
    }

    console.log("Starting video.mp4 streaming...");
    isStreaming = true;

    ffmpegProcess = spawn("ffmpeg", [
      "-re", // Read video at normal speed
      "-stream_loop",
      "-1", // Loop video (-1 for infinite loop)
      "-i",
      "public/uploads/video.mp4", // Input video file (user uploaded)
      "-c:v",
      "libx264", // Encode video as H.264
      "-preset",
      "ultrafast", // Low latency
      "-tune",
      "zerolatency",
      "-c:a",
      "aac", // Audio codec
      "-b:a",
      "128k",
      "-f",
      "flv", // RTMP format
      YOUTUBE_RTMP_URL,
    ]);

    ffmpegProcess.stderr.on("data", (data) => {
      console.error(`FFmpeg Error: ${data}`);
    });

    ffmpegProcess.on("close", () => {
      console.log("FFmpeg process stopped.");
      isStreaming = false;
      io.emit("stream-status", { status: "Stream Stopped" });
    });

    socket.emit("stream-status", { status: "Streaming Live" });
  });

  socket.on("stop-stream", () => {
    if (ffmpegProcess) {
      ffmpegProcess.kill();
      ffmpegProcess = null;
      isStreaming = false;
      io.emit("stream-status", { status: "Stream Stopped" });
      console.log("Streaming stopped.");
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    if (ffmpegProcess) {
      ffmpegProcess.kill();
      isStreaming = false;
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
