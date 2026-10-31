import { Link } from 'react-router-dom';

function AboutUs() {
  return (
    <div className="about-page">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="navbar-brand">🌿 Paradise Nursery</Link>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Plants</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/cart" className="cart-icon">🛒 Cart</Link></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div className="about-hero">
        <h1>About Paradise Nursery</h1>
        <p>Your trusted destination for beautiful, healthy houseplants since 2010.</p>
      </div>

      {/* Content */}
      <div className="about-content">
        <div className="about-card">
          <h2>Our Story</h2>
          <p>
            Paradise Nursery was founded in 2010 with a simple mission: to bring the beauty and
            tranquility of nature into every home. What started as a small family-run greenhouse
            in Portland, Oregon has grown into one of the most trusted online plant retailers in
            the country.
          </p>
          <p style={{ marginTop: '0.8rem' }}>
            We believe that plants transform spaces — they purify the air, boost mood, and make any
            environment feel more alive. Our team of dedicated horticulturists hand-selects each plant
            variety to ensure you receive only the highest quality specimens.
          </p>
        </div>

        <div className="about-card">
          <h2>Our Mission</h2>
          <p>
            To make plant parenthood accessible, enjoyable, and sustainable for everyone. We provide
            expert care guides with every purchase and offer a 30-day happiness guarantee on all our plants.
          </p>
        </div>

        <div className="about-card">
          <h2>Why Choose Us?</h2>
          <ul className="about-features">
            <li>Hand-picked, premium quality houseplants</li>
            <li>Expert care instructions included with every order</li>
            <li>Eco-friendly packaging and sustainable sourcing</li>
            <li>30-day happiness guarantee</li>
            <li>Free shipping on orders over $50</li>
            <li>A passionate team of plant enthusiasts ready to help</li>
          </ul>
        </div>

        <div className="about-card">
          <h2>Contact Us</h2>
          <p>📧 Email: hello@paradisenursery.com</p>
          <p>📞 Phone: (503) 555-0174</p>
          <p>📍 Address: 123 Green Valley Rd, Portland, OR 97201</p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
