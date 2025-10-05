# Convergimmob - Real Estate Web Application

A modern, responsive real estate web application built with React and integrated with a Node.js backend.

## Features

- 🏠 **Property Listings**: Browse and search properties with advanced filtering
- 🔍 **Location-based Search**: Find properties near you using geolocation
- 📱 **360° Virtual Tours**: View immersive property images and 360° tours
- 👤 **User Authentication**: Register, login, and manage your account
- 📝 **Property Management**: Add, edit, and delete your property listings
- 💰 **Multiple Property Types**: Support for Residential, Commercial, Industrial, and Land properties
- 📊 **Dashboard**: Track your property views and manage listings
- 🎨 **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS

## Tech Stack

### Frontend

- React 18
- React Router DOM
- Tailwind CSS
- React Icons
- Context API for state management

### Backend Integration

- RESTful API integration
- File upload support for images
- Authentication with JWT tokens
- Location-based property discovery

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 5000

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Real-Estate-App
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_BASE_URL=http://localhost:5000
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── Components/          # Reusable UI components
│   ├── Header.js       # Navigation header
│   ├── NavBar.jsx      # Navigation menu
│   ├── PropertyCard.js # Property listing card
│   ├── PropertyFilters.js # Property filtering component
│   ├── ImageGallery.js # Image gallery with 360° support
│   ├── ErrorBoundary.js # Error handling component
│   └── LoadingSpinner.js # Loading indicator
├── Pages/              # Page components
│   ├── Home.js         # Landing page
│   ├── PropertyList.js # Property listings page
│   ├── PropertyDetails.js # Property detail view
│   ├── Login.js        # User login
│   ├── Register.js     # User registration
│   ├── Dashboard.js    # User dashboard
│   └── AddProperty.js  # Add new property form
├── context/            # React Context for state management
│   └── AppContext.js   # Global app state
├── services/           # API services
│   └── api.js          # API integration functions
└── assets/             # Static assets
    ├── images/         # Image files
    └── logos/          # Logo files
```

## API Integration

The application integrates with the following backend endpoints:

### Properties

- `GET /api/users/properties` - Get all properties
- `GET /api/users/properties/:id` - Get property by ID
- `GET /api/users/properties/discover` - Discover properties by location
- `POST /api/users/properties` - Add new property
- `PUT /api/users/properties/:id` - Update property
- `DELETE /api/users/properties/:id` - Delete property

### Authentication

- `POST /api/users/auth/register` - User registration
- `POST /api/users/auth/login` - User login
- `GET /api/users/user/profile` - Get user profile

### News

- `GET /api/users/news` - Get news articles

### Visit Requests

- `POST /api/users/visit` - Request property visit

## Features in Detail

### Property Search & Filtering

- Filter by property type (Buy/Rent)
- Filter by property category (Residential, Commercial, Industrial, Land)
- Price range filtering
- Amenities filtering (Parking, Pool, Gym, Elevator)
- Location-based search with geolocation

### Property Management

- Add new properties with multiple images
- Support for 360° virtual tour images
- Property type-specific fields
- Image upload and management
- Property status tracking

### User Experience

- Responsive design for all devices
- Smooth animations and transitions
- Loading states and error handling
- Image galleries with fullscreen view
- Modern, clean interface

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@convergimmob.com or join our Slack channel.

## Acknowledgments

- Backend API provided by Convergimmob team
- Icons from React Icons
- UI components built with Tailwind CSS
