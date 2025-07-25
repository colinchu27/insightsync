# InsightSync 🧠

InsightSync is a personal knowledge manager built with the goal of helping users store, organize, and retrieve insights from articles, podcasts, books, or anywhere else they learn. Users can add, tag, edit, delete, search, and filter insights based on keywords and tags.

> 🚧 **This project is currently in progress.** 

---

## Features

- 🔍 **Search & Filter**: Quickly find insights by keyword or tag  
- 🏷️ **Clickable Tags**: Filter insights by clicking any tag  
- ✍️ **Add / Edit / Delete**: Fully manage insight entries  
- 📅 **Sort Options**: Sort by date or title, ascending or descending  
- 🧼 **Clear Filters**: One click to reset your search and tag filters  
- 🔗 **Smart Links**: Clean display of source URLs, or hidden if none provided  

---

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Database**: MongoDB (Atlas)
- **Styling**: Minimal inline CSS

---

## Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/YOUR_USERNAME/insightsync.git
cd insightsync
```

### 2. Set Up Environment

Create a `.env` file in the `/server` directory:

```env
MONGODB_URI=your-mongodb-uri-here
```

Make sure your MongoDB user has read/write access to your cluster.

### 3. Run the App

In one terminal:

```bash
cd server
npm install
npm run dev
```

In another terminal:

```bash
cd client
npm install
npm run dev
```

The app should now be running at `http://localhost:5173`.
