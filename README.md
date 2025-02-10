# VIDEO STREAMING

## REQUIREMENTS

- FFmpeg installed [Download here](https://ffmpeg.org/download.html)
- Node.js and Express
- fluent-ffmpeg (Node.js wrapper for FFmpeg)

## STEPS

1- Install FFmpeg and add it to your system's PATH (Mac):

- Terminal: `brew install ffmpeg`
- Terminal (Verify Installation): `ffmpeg -version`

2- Install required Node.js packages:

- Create a Project folder: `VIDEO-STREAMING`
- Create server folder: `server`
- Create: server.js
- Open terminal: (F1) : Create a new terminal : zhs
- Terminal:`cd server`
- Terminal(server):`npm init -y`
- Terminal(server):`npm install express socket.io dotenv multer`
- Terminal(server): `mkdir -p public/uploads`
- Create:`.gitignore` => node_modules & .env
- Create public folder
- Create `index.html` inside public folder

4- Create a .env file with your YouTube Live Stream Key:
`YOUTUBE_STREAM_KEY=your-youtube-stream-key-here`

5- RUN:

- Terminal (server): `node server.js`

6- Go Live on YouTube:

- Go to YouTube Studio Live Dashboard `https://studio.youtube.com/`

- Click Go Live → Stream.

