# ImmersiView 360 · Tour Editor

ImmersiView 360 is a full-stack web application for creating and managing immersive 360-degree virtual tours. It allows users to upload panoramic images, link rooms via hotspots, add informational markers, and experience smooth transitions in a high-performance 3D environment.

## ✨ Features

- **Full-Stack Persistence**: Tours and rooms are stored in a MongoDB database.
- **Advanced Image Handling**:
    - Server-side compression using `Sharp`.
    - Multiple resolution generation (Low, Medium, High) for progressive loading.
    - AWS S3 integration for scalable image storage (with local fallback).
- **Smooth Transitions**: Immersive cross-fade effects when moving between rooms.
- **Admin Dashboard**: Centralized interface for tour management and user access control.
- **Authentication**: JWT-based login for secure admin operations.
- **Dual Rendering**: Supports both Pannellum for standard panorama viewing and Three.js for more flexible 3D environments.

## 🛠️ Tech Stack

### Frontend
- **React 18**
- **Material UI (@mui/material)**
- **Pannellum-react**
- **Three.js (@react-three/fiber)**
- **Vite**

### Backend
- **Node.js & Express**
- **MongoDB (Mongoose)**
- **AWS S3 (@aws-sdk/client-s3)**
- **Sharp** (Image processing)
- **JWT** (Authentication)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a connection string)
- AWS Account (optional, for S3 storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd immersiview-360
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/immersiview
   JWT_SECRET=your_jwt_secret
   # AWS S3 Configuration (Optional)
   # AWS_REGION=us-east-1
   # AWS_ACCESS_KEY_ID=your_key
   # AWS_SECRET_ACCESS_KEY=your_secret
   # AWS_BUCKET_NAME=your_bucket
   ```

3. **Setup Frontend**
   ```bash
   cd ..
   npm install --legacy-peer-deps
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   node index.js
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd ..
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## 📁 Project Structure

- `src/`: React frontend application.
    - `components/`: UI components (TourManager, PanoramaViewer, AdminDashboard, etc.).
    - `api/`: API client for backend communication.
- `server/`: Node.js/Express backend.
    - `models/`: Mongoose schemas.
    - `routes/`: API endpoints.
    - `services/`: Business logic (S3 upload, image processing).
    - `middleware/`: Auth and error handling.
- `dist/`: Production build of the frontend.

## 🔑 Default Credentials

To seed an initial admin user, you can run:
```bash
node server/seed.js
```
Default credentials:
- **Username**: `admin`
- **Password**: `password123`

## 📄 License

ISC License.
