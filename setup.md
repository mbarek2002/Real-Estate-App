# Setup Instructions for Convergimmob Real Estate App

## Quick Start Guide

### 1. Backend Setup (Required First)

1. Navigate to the backend directory:

   ```bash
   cd /Volumes/ci/ci/cimmob/backendConvImmob-1
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with your MongoDB connection string:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will be running on http://localhost:5000

### 2. Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd /Volumes/ci/ci/cimmob/Real-Estate-App
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_BASE_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```
   The frontend will be running on http://localhost:3000

### 3. Testing the Integration

1. Open http://localhost:3000 in your browser
2. Try registering a new user account
3. Browse properties on the home page
4. Test the property search and filtering
5. Try adding a new property (requires login)

## API Endpoints Available

### Authentication

- `POST /api/users/auth/signup` - User registration
- `POST /api/users/auth/login` - User login
- `POST /api/users/auth/verifgmail` - Get user profile by email

### Properties

- `GET /api/users/properties` - Get all properties
- `GET /api/users/properties/:id` - Get property by ID
- `GET /api/users/properties/discover` - Discover properties by location
- `POST /api/users/properties` - Add new property
- `PUT /api/users/properties/:id` - Update property
- `DELETE /api/users/properties/:id` - Delete property

### News

- `GET /api/users/news` - Get news articles

### Visit Requests

- `POST /api/users/visit` - Request property visit

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure both frontend and backend are running on the correct ports
2. **API Connection Failed**: Check that the backend server is running and accessible
3. **Image Upload Issues**: Ensure the backend uploads directory has proper permissions
4. **Authentication Issues**: The backend doesn't use JWT tokens, it uses email-based sessions

### Backend Logs

Check the backend console for any error messages when testing API endpoints.

### Frontend Console

Open browser developer tools (F12) and check the Console tab for any JavaScript errors.

## Features Implemented

✅ **Complete Integration**

- API service layer with all backend endpoints
- User authentication (signup/login)
- Property listing and search
- Property details with image galleries
- Property management (add/edit/delete)
- Location-based property discovery
- Modern responsive UI design
- 360° image support

✅ **UI/UX Improvements**

- Modern design with Tailwind CSS
- Responsive layout for all devices
- Loading states and error handling
- Smooth animations and transitions
- Professional color scheme
- Intuitive navigation

## Next Steps

1. Test all functionality thoroughly
2. Add any missing features specific to your needs
3. Deploy to production when ready
4. Set up proper environment variables for production

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify backend server is running
3. Ensure all dependencies are installed
4. Check network connectivity between frontend and backend
