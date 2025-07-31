# InsightSync 🧠

**InsightSync** is a personal knowledge management tool I designed and built during my **Product Management internship** at **Ipserlabs** to improve team alignment, reduce knowledge silos, and streamline idea sharing across teams.

While managing specs, user feedback, research docs, and team syncs, I noticed a pattern: insights were scattered, forgotten, or buried in chat threads and notebooks. InsightSync solves that. It's a centralized, beautifully minimal space where insights from articles, research, customer calls, and internal docs can be saved, organized, and surfaced later by anyone on the team.

> 🚀 Originally built as an internal tool, now evolving into a fully fledged standalone product.

---

## ✨ Why I Built This

During my internship, I led multiple feature explorations and needed a way to:
- Track product insights across sources (user interviews, industry research, etc.)
- Share learnings with other team members without repeating myself
- Let designers, engineers, and execs quickly find past decisions, links, and rationale


---

## 🔥 Features

- 🔍 **Search & Filter**  
  Instantly filter insights by keywords or tags.

- 🏷️ **Clickable Tags**  
  Tap any tag to trigger automatic filtering.

- ✍️ **Add / Edit / Delete Insights**  
  Full control over every entry.

- 📅 **Sort Options**  
  Sort insights by date or title, ascending or descending.

- 🧼 **Clear Filters**  
  One click to reset all applied filters and searches.

- 🔗 **Smart Source Links**  
  Automatically formats and displays source URLs (hidden if not provided).

- 🌍 **Public Collections**  
  Create and browse community-curated or team-facing collections.

- 🔐 **Private vs Public Toggle (Coming Soon)**  
  Let users choose whether to keep collections private or share them across the org.

---

## 🧱 Tech Stack

**Frontend:** React + Vite  
**Backend:** Node.js + Express  
**Database:** MongoDB Atlas  
**Styling:** Tailwind style custom utility classes

---


## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/YOUR_USERNAME/insightsync.git
cd insightsync


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
