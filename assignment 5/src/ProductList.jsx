import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addItem } from './CartSlice';

// ── Plant data – 3 categories × 6 plants each ──────────────────────────────
const plantsData = [
  {
    category: 'Air-Purifying Plants',
    plants: [
      {
        name: 'Peace Lily',
        image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e6a12?w=400&auto=format&fit=crop',
        description: 'Thrives in low light and removes toxins from the air.',
        price: 12.99,
      },
      {
        name: 'Spider Plant',
        image: 'https://images.unsplash.com/photo-1598880940372-c1e2d1a48591?w=400&auto=format&fit=crop',
        description: 'Easy to grow and excellent at filtering formaldehyde.',
        price: 8.99,
      },
      {
        name: 'Snake Plant',
        image: 'https://images.unsplash.com/photo-1597055181300-e3633a917f0f?w=400&auto=format&fit=crop',
        description: 'Virtually indestructible and purifies air at night.',
        price: 14.99,
      },
      {
        name: 'Aloe Vera',
        image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400&auto=format&fit=crop',
        description: 'Soothes skin burns and removes airborne pollutants.',
        price: 9.99,
      },
      {
        name: 'Boston Fern',
        image: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=400&auto=format&fit=crop',
        description: 'Adds humidity and removes indoor air pollutants.',
        price: 11.99,
      },
      {
        name: 'Bamboo Palm',
        image: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&auto=format&fit=crop',
        description: 'A natural humidifier that filters benzene and formaldehyde.',
        price: 18.99,
      },
    ],
  },
  {
    category: 'Low-Maintenance Plants',
    plants: [
      {
        name: 'ZZ Plant',
        image: 'https://images.unsplash.com/photo-1619454016518-697bc231e7cb?w=400&auto=format&fit=crop',
        description: 'Thrives on neglect — perfect for busy plant lovers.',
        price: 16.99,
      },
      {
        name: 'Pothos',
        image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&auto=format&fit=crop',
        description: 'Nearly impossible to kill and great for beginners.',
        price: 7.99,
      },
      {
        name: 'Cast Iron Plant',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&auto=format&fit=crop',
        description: 'Tolerates low light, drought, and temperature extremes.',
        price: 13.99,
      },
      {
        name: 'Rubber Plant',
        image: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=400&auto=format&fit=crop',
        description: 'Dramatic glossy leaves with minimal care requirements.',
        price: 15.99,
      },
      {
        name: 'Jade Plant',
        image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&auto=format&fit=crop',
        description: 'A resilient succulent believed to bring good fortune.',
        price: 10.99,
      },
      {
        name: 'Dracaena',
        image: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&auto=format&fit=crop',
        description: 'Bold foliage that tolerates low light and irregular watering.',
        price: 17.99,
      },
    ],
  },
  {
    category: 'Flowering & Tropical Plants',
    plants: [
      {
        name: 'Anthurium',
        image: 'https://images.unsplash.com/photo-1567696153798-9111f9cd3d0d?w=400&auto=format&fit=crop',
        description: 'Produces stunning waxy flowers year-round.',
        price: 19.99,
      },
      {
        name: 'Bird of Paradise',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop',
        description: 'Dramatic tropical foliage that makes a bold statement.',
        price: 29.99,
      },
      {
        name: 'Bromeliad',
        image: 'https://images.unsplash.com/photo-1599598425947-5202edd56bdb?w=400&auto=format&fit=crop',
        description: 'Vibrant tropical blooms that last for months.',
        price: 14.99,
      },
      {
        name: 'Orchid',
        image: 'https://images.unsplash.com/photo-1566842600175-97dca3c5ad8e?w=400&auto=format&fit=crop',
        description: 'Elegant blooms that add sophistication to any room.',
        price: 24.99,
      },
      {
        name: 'Hibiscus',
        image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400&auto=format&fit=crop',
        description: 'Produces large, colourful flowers that brighten any space.',
        price: 16.99,
      },
      {
        name: 'Monstera Deliciosa',
        image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&auto=format&fit=crop',
        description: 'Iconic split leaves — the Instagram superstar of houseplants.',
        price: 22.99,
      },
    ],
  },
];

// ── Navbar component (shared) ──────────────────────────────────────────────
function Navbar() {
  const cartItems = useSelector(state => state.cart.items);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🌿 Paradise Nursery</Link>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Plants</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li>
          <Link to="/cart" className="cart-icon">
            🛒 Cart
            {totalCount > 0 && (
              <span className="cart-badge">{totalCount}</span>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

// ── ProductList component ──────────────────────────────────────────────────
function ProductList() {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  // Track which plants have been added (by name)
  const [addedPlants, setAddedPlants] = useState({});

  const isInCart = (plantName) => {
    return cartItems.some(item => item.name === plantName) || addedPlants[plantName];
  };

  const handleAddToCart = (plant) => {
    dispatch(addItem(plant));
    setAddedPlants(prev => ({ ...prev, [plant.name]: true }));
  };

  return (
    <div className="product-page">
      <Navbar />

      <div className="product-page-header">
        <h2>Our Plant Collection</h2>
        <p>Choose from our carefully curated selection of beautiful houseplants.</p>
      </div>

      {plantsData.map((categoryData) => (
        <div key={categoryData.category} className="category-section">
          <h3 className="category-title">{categoryData.category}</h3>
          <div className="plant-grid">
            {categoryData.plants.map((plant) => (
              <div key={plant.name} className="plant-card">
                <img src={plant.image} alt={plant.name} />
                <div className="plant-info">
                  <div className="plant-name">{plant.name}</div>
                  <div className="plant-description">{plant.description}</div>
                  <div className="plant-price">${plant.price.toFixed(2)}</div>
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(plant)}
                  disabled={isInCart(plant.name)}
                >
                  {isInCart(plant.name) ? '✓ Added' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export { Navbar };
export default ProductList;
