import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/cartSlice";

function Cart() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const convertToINR = (usd) => {
    const rate = 83;
    return (usd * rate).toLocaleString("en-IN");
  };

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Cart is Empty!");
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="container home-container">
      <h2 className="home-title">Your Cart</h2>

      {items.length === 0 ? (
        <h3 style={{ textAlign: "center" }}>Cart is Empty</h3>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.thumbnail}
                alt={item.title}
                style={{ width: "100px" }}
              />

              <div>
                <h4>{item.title}</h4>

                <p>Price: ₹{convertToINR(item.price)}</p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    margin: "10px 0",
                  }}
                >
                  <button
                    onClick={() =>
                      dispatch(decreaseQuantity(item.id))
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      dispatch(increaseQuantity(item.id))
                    }
                  >
                    +
                  </button>
                </div>

                <p>
                  Total: ₹
                  {convertToINR(item.price * item.quantity)}
                </p>

                <button
                  className="btn"
                  onClick={() =>
                    dispatch(removeFromCart(item.id))
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <hr />

          <h2>
            Grand Total: ₹{convertToINR(totalPrice)}
          </h2>

          <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
            <button
              className="btn"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>

            <button
              className="btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;