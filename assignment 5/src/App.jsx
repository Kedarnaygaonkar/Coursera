import { Routes, Route, Link } from 'react-router-dom';
import ProductList from './ProductList';
import CartItem from './CartItem';
import AboutUs from './AboutUs';

function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route
        path="/"
        element={
          <div className="landing-container">
            <div className="landing-content">
              <h1>🌿 Paradise Nursery</h1>
              <p>Bring nature indoors — discover our hand-picked collection of beautiful houseplants.</p>
              <Link to="/products" className="get-started-btn">
                Get Started
              </Link>
            </div>
          </div>
        }
      />
      {/* Product Listing Page */}
      <Route path="/products" element={<ProductList />} />
      {/* Cart Page */}
      <Route path="/cart" element={<CartItem />} />
      {/* About Us Page */}
      <Route path="/about" element={<AboutUs />} />
    </Routes>
  );
}

export default App;
