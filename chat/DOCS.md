# Chat Project — Quick Docs & How to Try / Test 🧪

This document explains how to set up, run, and test the WhatsApp-style web chat project locally or with Docker. It includes commands for Windows (PowerShell/Command Prompt) and notes for troubleshooting.

---

## Prerequisites ✅

- Node.js (v16+ recommended) and npm installed: https://nodejs.org/
- Git (optional) to clone the repo
- Docker & Docker Compose (optional, if using Docker): https://docs.docker.com/
- A modern browser (Chrome / Edge / Firefox)


## Files of interest 🔧

- `server.js` — Node + Express + Socket.IO server
- `package.json` — scripts and dependencies
- `public/index.html` — login / register UI
- `public/chat.html` — chat UI
- `data/users.json` — user store (persisted by Docker named volume when using Docker)
- `Dockerfile` — backend image
- `docker/frontend.Dockerfile` & `docker/nginx.conf` — frontend nginx image & proxy config
- `docker-compose.yml` — orchestrates frontend + backend

---

## Running locally (without Docker) — easy for development 🖥️

1. Open a terminal in the project root (d:\simple chatting\chat)

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

   - The backend listens on port 4000 by default (unless you set the `PORT` or `BACKEND_PORT` env var).
   - Open the client UI pages at `http://localhost:4000/index.html` and `http://localhost:4000/chat.html`.

4. Test flow manually:
   - Open two browser windows/tabs.
   - In each tab, open `http://localhost:4000` (the login page).
   - Register different usernames (e.g., alice and bob).
   - After registering / logging in, you will be redirected to `chat.html?user=<id>`.
   - In one tab, select the other user in the contacts list and send messages. Messages should appear instantly in both tabs.

---

## Running with Docker (recommended to demo both frontend & backend together) 🐳

1. Ensure Docker Desktop is running on Windows.

2. (Optional) Edit `.env` to change `BACKEND_PORT` or `FRONTEND_PORT`.

3. Start services:

   ```bash
   docker-compose up --build
   ```

   or run in the background:

   ```bash
   docker-compose up -d --build
   ```

4. Open the app in the browser:

   - Frontend (served by nginx): http://localhost (port 80 by default)
   - Backend direct (if needed): http://localhost:4000

5. Data persistence: Docker Compose mounts a named volume `chat_data` to `data/`, so `users.json` persists across restarts. To remove data use:

   ```bash
   docker-compose down -v
   ```

---

## Quick automated checks & manual tests ✅

Manual checklist (recommended for demos):

1. Register user A (Alice) and note the redirected `user` id in the URL.
2. Register user B (Bob) in another tab.
3. In Alice's tab, select Bob from the users list; send a message.
4. Observe Bob's tab receive the message instantly.
5. Stop and restart backend (or compose services) to confirm `users.json` persisted (users still exist).

Simple HTTP checks:

- Get users list:
  ```bash
  curl http://localhost:4000/users
  ```
  You should see JSON array of users including ids and usernames.

- Register user using curl:
  ```bash
  curl -X POST http://localhost:4000/register -H "Content-Type: application/json" -d "{ \"username\": \"alice\" }"
  ```

Socket / WebSocket tests:

- The easiest test is in the browser UI (chat.html) as Socket.IO is already wired into the client.
- If you prefer CLI WebSocket tools, try `wscat` but Socket.IO requires the Socket.IO client protocol so using the browser is simplest.

---

## Troubleshooting ⚠️

- If frontend cannot load /socket.io: check that nginx `docker/nginx.conf` proxies `/socket.io` to `backend:4000` and that backend is running.
- If `users.json` disappears after container restart: ensure you have the named volume `chat_data` configured in `docker-compose.yml`. Also check `docker volume ls` and `docker volume inspect chat_chat_data`.
- If `npm start` returns EADDRINUSE: another process is using the port. Change the port via env: `set PORT=5000` (Windows CMD) or `$env:PORT=5000` (PowerShell) then `npm start`.
- Check server logs (backend):
  - Local: console output from `npm start`.
  - Docker: `docker-compose logs -f backend`.

---

## How to reset data 🧹

- Delete the file `data/users.json` (or clear its contents) and restart the server.
- With Docker, run `docker-compose down -v` to remove containers and volumes (this deletes persisted data permanently).

---

## Tips for learning and extension 💡

- Add a persistent DB (MongoDB) to replace the `users.json` file and the in-memory `messages` array.
- Add tests for HTTP endpoints with a framework like `mocha` or `jest`.
- Add typing indicators and read receipts using additional Socket.IO events.
- Add basic authentication (JWT) to secure endpoints.

---

## If you want, I can also:

- Add a `make it one command` script (`scripts/start-dev.bat` for Windows) that runs Docker Compose. ✅
- Add a small `/debug/messages` endpoint to inspect in-memory messages for easier testing. ✅
- Add sample screenshots and a short demo GIF to the repo. ✅

Tell me which of the above you want next and I will add it.

---

Happy demoing! 🚀
