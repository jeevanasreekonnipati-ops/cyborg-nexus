# Cyborg Nexus — Task 1

A lightweight interactive web application showcasing a static front-end with a real-time Node.js backend.

## Overview

Cyborg Nexus provides a simple socket-driven communication experience. The server is built with Express and Socket.IO, delivering static assets and real-time chat updates for connected clients.

## Project summary

This project demonstrates how to combine a static front-end with a Node.js back-end to create an interactive networked application. It includes a real-time node counter, system messages, and broadcast chat functionality.

## Project structure

- `index.html` — application user interface
- `styles.css` — styling for the front-end
- `script.js` — client-side socket handling and UI logic
- `server.js` — Express server and Socket.IO real-time engine
- `package.json` — project configuration and dependencies
- `README.md` — project documentation

## Features

- Static file serving with Express
- Real-time connection tracking using Socket.IO
- Dynamic welcome message and chat broadcasting
- Simulated active node count for a polished experience

## Installation

```bash
npm install
```

## Usage

```bash
node server.js
```

Then open your browser to:

```
http://localhost:3000
```

### Example interaction

1. Launch the app in your browser.
2. Connect to the socket server.
3. Send a message and watch it broadcast to all connected clients.
4. Observe the live active node count update in real time.

## Dependencies

- `express`
- `socket.io`

## Notes

- The project uses CommonJS modules.
- Make sure dependencies are installed before running the server.
- The default port is `3000`, and can be overridden by setting `PORT`.
