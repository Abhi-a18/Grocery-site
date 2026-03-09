  import { useSelector, useDispatch } from "react-redux";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { clearCart } from "../redux/cartSlice";

  function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartItems = useSelector((state) => state.cart.items);
    const user = useSelector((state) => state.auth.user);

    const [formData, setFormData] = useState({
      fullName: "",
      email: user?.email || "",
      address: "",
      paymentMethod: "COD",
    });

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const totalAmount = cartItems.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );

    const handleSubmit = (e) => {
      e.preventDefault();

      if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      alert("Order placed successfully 🎉");

      dispatch(clearCart());  
      navigate("/home");       
    };

    return (
      <div className="container2" style={{ padding: "30px" ,border: '1px solid black' , borderRadius: '8px' ,marginTop:"30px"}}>
        <h2 className="flex justify-center">Checkout</h2>

        <h3 className="txt flex justify-center color-green-700">Order Summary</h3>

        {cartItems.map((item) => (
          <div key={item.id}>
            <p className="flex justify-center">
              {item.title} × {item.quantity} = ₹
              {item.price * item.quantity}
            </p>
          </div>
        ))}

        <h3 className="flex justify-center">Total: ₹{totalAmount}</h3>

        <hr />

        <h3 className=" txt flex justify-center"> Shipping Details</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full"
          />
          <br /><br />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <br /><br />

          <textarea
          className="w-full"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <br /><br />
          <h3 className="flex m-40px"> Deleviery method
              <div  style={{borderRadius: '2px solid black'}}>
          <select
          
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
          
            <option value="COD">Cash on Delivery</option>
            <option value="UPI">UPI</option>
            <option value="Card">Debit/Credit Card</option>
          </select>
          </div>
          </h3>

          <br /><br />

          <button className="btn" type="submit">
            Place Order
          </button>
        </form>
      </div>
    );
  }

  export default Checkout;