import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import VenueDetail from './pages/VenueDetail';
import Booking from './pages/Booking';
import Compare from './pages/Compare';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminPanel from './pages/AdminPanel';
import OwnerOnboarding from './pages/OwnerOnboarding';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/venue/:id" element={<VenueDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard/user" element={<UserDashboard />} />
          <Route path="/dashboard/owner" element={<OwnerDashboard />} />
          <Route path="/dashboard/admin" element={<AdminPanel />} />
          <Route path="/onboarding/owner" element={<OwnerOnboarding />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
