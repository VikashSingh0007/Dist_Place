import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LiveTracking from './components/LiveTracking';
import LiveMap from './components/LiveMap';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './components/Home'; // Import Home component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/live-tracking" element={<LiveTracking />} />
        <Route path="/map" element={<LiveMap />} />
        <Route path="/" element={<Home />} /> {/* Set Home as the default route */}
      </Routes>
    </Router>
  );
}

export default App;
