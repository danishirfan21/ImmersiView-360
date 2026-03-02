# ImmersiView 360

ImmersiView 360 is a comprehensive 360-degree virtual tour editor and viewer. It allows users to create immersive virtual tours by uploading panorama images, managing rooms, and adding interactive hotspots for navigation and information.

## Features

- **360° Panorama Viewer**: Smooth and interactive 360-degree viewing experience using Pannellum and Three.js.
- **Tour Management**: Create, edit, and manage multiple virtual tours.
- **Room Navigation**: Link different rooms within a tour using interactive hotspots.
- **Hotspot Editor**: Add, position, and customize hotspots for navigation or informational popups.
- **Progressive Loading**: Panorama images are processed into multiple resolutions (low, medium, high) for optimized loading.
- **Admin Dashboard**: Secure login and dashboard for managing tours and users.
- **Cloud Storage**: Support for AWS S3 for hosting high-resolution panoramas, with local fallback.

## Tech Stack

### Frontend
- **React**: UI library.
- **Vite**: Modern frontend build tool.
- **Material UI (MUI)**: For styled components and layout.
- **Pannellum & React-Three-Fiber**: For rendering 360-degree panoramas.
- **Three.js**: underlying 3D engine.

### Backend
- **Node.js & Express**: Backend server.
- **MongoDB & Mongoose**: Database for storing tour metadata, room configurations, and user accounts.
- **Sharp**: For image processing and generating multiple resolutions.
- **AWS SDK**: For S3 integration.
- **JWT**: For secure authentication.

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- MongoDB (running locally or a connection string to MongoDB Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd immersiview-360
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
   *Note: `--legacy-peer-deps` is required due to peer dependency conflicts between React 18 and some libraries.*

3. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

### Configuration

Create a `.env` file in the `server/` directory and add the following environment variables:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/immersiview
JWT_SECRET=your_jwt_secret_here

# AWS S3 Configuration (Optional - Fallback to local storage if not provided)
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_BUCKET_NAME=your_bucket_name
```

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd server
   node index.js
   ```

2. **Start the Frontend Development Server:**
   In a new terminal window at the project root:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Project Structure

- `src/`: React frontend source code.
  - `components/`: UI components (TourManager, PanoramaViewer, HotspotEditor, etc.).
  - `api/`: API service layer for communicating with the backend.
- `server/`: Express backend source code.
  - `models/`: Mongoose schemas (Tour, Room, User).
  - `routes/`: API endpoints.
  - `services/`: Business logic (Image processing, S3 storage).
  - `uploads/`: Local storage for uploaded panoramas (if S3 is not configured).

## License

ISC
