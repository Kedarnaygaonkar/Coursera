import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem, updateQuantity } from './CartSlice';
import { Navbar } from './ProductList';

function CartItem() {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  // Total amount for all items in cart
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleIncrement = (item) => {
    dispatch(updateQuantity({ name: item.name, quantity: item.quantity + 1 }));
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ name: item.name, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeItem(item.name));
    }
  };

  const handleDelete = (itemName) => {
    dispatch(removeItem(itemName));
  };

  const handleCheckout = () => {
    alert('🛍️ Coming Soon! Thank you for shopping at Paradise Nursery.');
  };

  return (
    <div className="cart-page">
      <Navbar />

      <div className="cart-page-header">
        <h2>🛒 Your Shopping Cart</h2>
      </div>

      <div className="cart-container">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty. 🌱</p>
            <Link to="/products" className="continue-btn" style={{ marginTop: '1rem', display: 'inline-block' }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            {cartItems.map((item) => (
              <div key={item.name} className="cart-item-card">
                <img src={item.image} alt={item.name} />

                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="unit-price">Unit Price: ${item.price.toFixed(2)}</p>
                  <p className="subtotal">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="cart-item-controls">
                  <button className="qty-btn" onClick={() => handleDecrement(item)}>−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => handleIncrement(item)}>+</button>
                  <button className="delete-btn" onClick={() => handleDelete(item.name)}>
                    🗑 Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Cart Summary */}
            <div className="cart-summary">
              <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>

              <div className="cart-actions">
                <Link to="/products" className="continue-btn">
                  ← Continue Shopping
                </Link>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Checkout 🛍️
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartItem;
