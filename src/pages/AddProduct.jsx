import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/ProductSlice";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    thumbnail: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      id: Date.now(),
      title: formData.title,
      price: Number(formData.price),
      category: formData.category,
      description: formData.description,
      thumbnail: formData.thumbnail,
      rating: 4,
    };

    dispatch(addProduct(newProduct));
    navigate("/home");
  };

  return (
    <div className="container" style={{ padding: "x" ,display: "flex" ,alignItems: "center",justifyContent: "center", flexDirection: "column"}}>
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>

        <input
          type="text"
          name="title"
          placeholder="Product Name"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price (USD)"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="thumbnail"
          placeholder="Image URL"
          value={formData.thumbnail}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;