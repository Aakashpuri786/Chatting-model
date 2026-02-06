# WhatsApp-Style Web Chat Project Documentation

## Project Overview

This project is a **real-time WhatsApp-style chat application** built using Node.js, Express, Socket.IO, and vanilla HTML/CSS/JS. The goal is to create a **multi-user chat platform** where users can register, log in, view a contacts list, and chat in real-time. Messages are displayed in a familiar WhatsApp-style UI with messages aligned left/right depending on sender.

---

## 1. Features to Include

### Core Features

1. **User Registration & Login**

   * Users can register with a unique username.
   * Login to existing account.
   * Redirect users to their **unique chat page**.

2. **Contacts List / Users List**

   * Show all users except current logged-in user.
   * Click on a user to start chatting.
   * Highlight selected user.

3. **Real-Time Chat**

   * Messages delivered instantly using **Socket.IO**.
   * Messages stored in memory (later can use database).
   * Messages aligned **right** for self and **left** for others.

4. **Multi-User Support**

   * Each user has a **unique ID and room**.
   * Messages sent only to selected user.
   * Multiple users can be online at the same time.

5. **Chat History**

   * Send previous messages on load.
   * Filter messages for the selected user.

### Advanced Features (Optional for Best Project)

1. **Persistent Database**

   * Use MongoDB or Firebase to store users and messages.
   * Offline messages delivered when user reconnects.

2. **Add Friends / Contacts**

   * Add new users to your contacts list.
   * Invite friends via a unique link.

3. **Typing Indicators & Read Receipts**

   * Show "User is typing...".
   * Show message read/delivered status.

4. **Profile Pictures & Status**

   * Add avatars for users.
   * Show online/offline status.

5. **Responsive Design**

   * Mobile-friendly UI.
   * Chat bubbles adjust on different screen sizes.

6. **Security**

   * Use HTTPS for transport security.
   * Optionally implement JWT authentication.
   * Optionally implement end-to-end encryption for messages.

---

## 2. Folder Structure

```
project/
├─ server.js           # Node.js + Express + Socket.IO server
├─ package.json        # Project dependencies
├─ data/
│   └─ users.json      # Users data (or DB later)
├─ public/
│   ├─ index.html      # Login / Register page
│   ├─ chat.html       # Chat interface
│   └─ style.css       # CSS for WhatsApp-style UI
```

---

## 3. UI Design Guidelines

### Layout

1. **Sidebar**

   * Width: 200px
   * Background: #f5f5f5
   * User list with clickable items

2. **Chat Window**

   * Flex: 1 (fill remaining space)
   * Messages container scrollable
   * Input bar at bottom with rounded text field and send button

### Messages

* **Your messages**: green bubbles, aligned right
* **Other user messages**: grey bubbles, aligned left
* Rounded corners, padding, and margin for spacing
* Scroll to latest message automatically

### Colors & Fonts

* Font: Arial or similar sans-serif
* Background: light (#f0f0f0)
* Chat window: white (#fff)
* Input field: white with border radius
* Send button: blue (#0084ff) with white text

---

## 4. How to Build / Steps

### Step 1: Setup Project

```bash
mkdir whatsapp-chat
cd whatsapp-chat
npm init -y
npm install express socket.io
mkdir public data
```

### Step 2: Create server.js

* Include **user management** (register/login)
* Include **Socket.IO real-time chat**
* In-memory messages array
* Serve static files from `public`

### Step 3: Create Frontend

* `index.html` for login/register
* `chat.html` for chat UI
* `style.css` for WhatsApp-style design
* Include **Socket.IO client script**

### Step 4: Real-Time Messaging

* Join room by `userId`
* Send/receive messages using `socket.emit` and `socket.on`
* Filter messages based on selected contact
* Update messages dynamically in UI

### Step 5: Contacts List

* Fetch users from server (`GET /users`)
* Exclude current user
* Clickable list items to select user
* Load chat history for selected user

### Step 6: Test Multi-User

* Open multiple tabs with different users
* Send messages between users
* Verify real-time delivery

### Step 7: Optional Enhancements

* Replace in-memory messages with **database storage**
* Implement **add friend / invite** functionality
* Add **profile pictures / online status / typing indicators**
* Make responsive for mobile screens

---

## 5. Text Prompt / Project Description for AI or Documentation

> Create a real-time web chat application similar to WhatsApp. Users can register and log in. Each user has a unique ID and a contacts list showing other registered users. Users can select any contact and chat in real-time using WebSocket (Socket.IO). Chat messages should appear as green bubbles for self and grey for others, aligned like WhatsApp. Messages should scroll automatically. Include multi-user support so that multiple users can chat simultaneously. Optionally include profile pictures, typing indicators, read receipts, offline message storage, and responsive design for mobile and desktop. Use Node.js, Express, Socket.IO, and a database for persistent storage.

---

## 6. Summary

This project combines **backend (Node.js + Socket.IO)** and **frontend (HTML/CSS/JS)** to simulate a WhatsApp-style web chat application. By following the steps, you can build a project that:

* Supports multiple users
* Real-time messaging
* WhatsApp-like UI
* Dynamic contacts list
* Scalable for more features (database, offline messages, etc.)

Once completed, it’s a **fully functional chat platform** that feels like WhatsApp and can be expanded further for production-level use.

---

## How to Run

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
node server.js
```

3. Open `http://localhost:3000` in multiple browser tabs to test multi-user chat.

---

## Next Steps & Suggestions

- Add tests and CI setup ✅
- Integrate a persistent database (MongoDB / Firebase) for user and message storage ✅
- Add screenshots and example usage to the README for clarity ✅

---

If you want, I can also add a `start` script to `package.json`, update `server.js` comments, or add example screenshots to the README.

---

## Docker & docker-compose 🐳
You can run the frontend (nginx) and backend (Node) together using `docker-compose` (both services are included in `docker-compose.yml`). The frontend serves the static UI and proxies API and WebSocket requests to the backend, so you can open `http://localhost` to access the app.

Quick start:

```bash
# Build images (optional)
docker-compose build

# Start services
docker-compose up
```

- Frontend: http://localhost (port 80)
- Backend: http://localhost:4000 (also proxied by nginx)

Notes:
- `docker-compose.yml` builds two services: `backend` (Node app) and `frontend` (nginx). ✅
- The `docker/nginx.conf` proxies `/socket.io` and `/register`/`/login`/`/users` to the backend so the frontend works seamlessly. ✅
- The `docker-compose.yml` now includes a **named volume `chat_data`** mounted to `/usr/src/app/data` so `data/users.json` persists across container restarts. ✅
- Add a `.env` file to customize ports and environment settings (example `.env` included). This config is loaded by `docker-compose`. 🔧

> Tip: Run `docker-compose up -d` to start services in the background. Use `docker-compose down -v` to remove containers and volumes (be careful, this deletes persisted data).
