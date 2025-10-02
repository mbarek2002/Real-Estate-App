import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import PropertyDetails from "./Pages/PropertyDetails";
import PropertyList from "./Pages/PropertyList";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import Explore from "./Pages/Explore";
import AddProperty from "./Pages/AddProperty";
import VisitRequests from "./Pages/VisitRequests";
import LoadingSpinner from "./Components/LoadingSpinner";
import ErrorBoundary from "./Components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<PropertyList />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/add-property" element={<AddProperty />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/visit-requests" element={<VisitRequests />} />
              </Routes>
            </main>
            <LoadingSpinner />
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
