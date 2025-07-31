# InsightSync

A beautiful web application for capturing, organizing, and sharing insights. Users can create individual insights and organize them into collections for better knowledge management.

## Features

### Insights Management
- ✅ Create, edit, and delete insights
- ✅ Add titles, sources, takeaways, and tags
- ✅ Set visibility (public/private)
- ✅ Search and filter insights
- ✅ Sort by date or title

### Collections Management
- ✅ Create new collections with custom names and descriptions
- ✅ Edit existing collections
- ✅ Delete collections
- ✅ Set collection visibility (public/private)
- ✅ Add insights to collections
- ✅ Remove insights from collections
- ✅ View collection statistics and previews
- ✅ Browse all collections (public and private)

### User Interface
- ✅ Modern, responsive design with glassmorphism effects
- ✅ Intuitive navigation between insights and collections
- ✅ Modal forms for creating and editing
- ✅ Real-time updates and state management
- ✅ Loading states and error handling

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd insightsync
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5050
   ```

5. **Start the server**
   ```bash
   cd ../server
   npm start
   ```

6. **Start the client**
   ```bash
   cd ../client
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173` to access the application.

## Usage

### Creating Insights
1. Navigate to the home page
2. Fill out the insight form with title, source, takeaway, and tags
3. Choose visibility (public or private)
4. Click "Add New Insight"

### Managing Collections
1. Click "View Collections" from the home page
2. Click "Create New Collection" to add a new collection
3. Fill in the collection name, description, and visibility
4. Use the "Manage" button to add/remove insights from collections
5. Use "Edit" to modify collection details
6. Use "Delete" to remove collections

### Adding Insights to Collections
1. Go to the Collections page
2. Click "Manage" on any collection
3. Select an insight from the dropdown
4. Click "Add to Collection"
5. Use "Remove" to take insights out of collections

## API Endpoints

### Insights
- `GET /api/insights` - Get all insights
- `POST /api/insights` - Create new insight
- `PUT /api/insights/:id` - Update insight
- `DELETE /api/insights/:id` - Delete insight

### Collections
- `GET /api/collections` - Get all collections
- `GET /api/collections/public` - Get public collections only
- `POST /api/collections` - Create new collection
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection
- `POST /api/collections/:id/insights` - Add insight to collection
- `DELETE /api/collections/:id/insights/:insightId` - Remove insight from collection

## Technology Stack

- **Frontend**: React 19, Vite, React Router DOM
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Styling**: Custom CSS with glassmorphism design

## Project Structure

```
insightsync/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main insights page
│   │   ├── Collections.jsx # Collections management
│   │   ├── CollectionForm.jsx # Collection creation/editing
│   │   ├── InsightManager.jsx # Insight management within collections
│   │   └── App.css        # Styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/
│   │   ├── collection.js  # Collection model
│   │   └── Insight.js     # Insight model
│   ├── routes/
│   │   ├── collectionRoutes.js # Collection API routes
│   │   └── insightRoutes.js    # Insight API routes
│   └── index.js           # Server entry point
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
