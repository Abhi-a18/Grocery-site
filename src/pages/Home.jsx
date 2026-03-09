import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { setProducts } from "../redux/ProductSlice";

function Home({ searchTerm }) {

  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.products);
  const cartItems = useSelector((state) => state.cart.items);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [ratings, setRatings] = useState({});
  const [quantities, setQuantities] = useState({});

  /* PAGINATION STATE */
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  const convertToINR = (usd) => {
    return (usd * 83).toLocaleString("en-IN");
  };

  useEffect(() => {

    const fetchProducts = async () => {
      try {

        const res = await axios.get("https://dummyjson.com/products");

        if (res.data && res.data.products) {

          dispatch(setProducts(res.data.products));

          const qty = {};
          res.data.products.forEach((p) => {
            qty[p.id] = 1;
          });

          setQuantities(qty);
        }

      } catch (error) {
        console.log("API Error:", error);
      }
    };

    if (products.length === 0) {
      fetchProducts();
    }

  }, [dispatch]);


  useEffect(() => {

    if (!products.length) return;

    const uniqueCategories = [
      "all",
      ...new Set(products.map((p) => p.category))
    ];

    setCategories(uniqueCategories);

  }, [products]);


  useEffect(() => {

    let updated = [...products];

    if (searchTerm) {
      updated = updated.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      updated = updated.filter(
        (item) => item.category === selectedCategory
      );
    }

    if (sortOrder === "low") {
      updated.sort((a, b) => a.price - b.price);
    }

    if (sortOrder === "high") {
      updated.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updated);
    setCurrentPage(1);

  }, [products, searchTerm, selectedCategory, sortOrder]);


  const isInCart = (id) =>
    cartItems.some((item) => item.id === id);


  const increaseQty = (id) => {

    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] + 1
    }));

  };


  const decreaseQty = (id) => {

    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1
    }));

  };


  const handleRating = (productId, value) => {

    setRatings((prev) => ({
      ...prev,
      [productId]: value
    }));

  };


  const renderStars = (productId, apiRating) => {

    const currentRating =
      ratings[productId] || Math.round(apiRating);

    return (

      <div style={{ display: "flex", gap: "5px", cursor: "pointer" }}>

        {[1,2,3,4,5].map((star) => (

          <span
            key={star}
            style={{
              fontSize: "18px",
              color: star <= currentRating ? "gold" : "#ccc"
            }}
            onClick={() => handleRating(productId, star)}
          >
            ★
          </span>

        ))}

      </div>

    );

  };


  /* PAGINATION LOGIC */

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts =
    filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages =
    Math.ceil(filteredProducts.length / productsPerPage);



  return (

    <div className="container home-container flex align-center flex-col">

      <h2>Products</h2>


      <div style={{ marginBottom: "20px" }}>

        {categories.map((cat) => (

          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              margin: "5px",
              padding: "6px 12px",
              background: selectedCategory === cat ? "#000" : "#eee",
              color: selectedCategory === cat ? "#fff" : "#000",
              border: "none",
              cursor: "pointer"
            }}
          >
            {cat}
          </button>

        ))}

      </div>


      <div style={{ marginBottom: "20px" }}>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >

          <option value="">Sort By Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>

        </select>

      </div>


      <div className="product-grid">

        {currentProducts.map((item) => {

          const quantity = quantities[item.id] || 1;

          return (

            <div key={item.id} className="product-card">

              <img src={item.thumbnail} alt={item.title} />

              <h4>{item.title}</h4>

              <p>₹{convertToINR(item.price)}</p>

              {renderStars(item.id, item.rating)}


              {isInCart(item.id) && (

                <div style={{ margin: "10px 0" }}>

                  <button onClick={() => decreaseQty(item.id)}>-</button>

                  <span style={{ margin: "0 10px" }}>
                    {quantity}
                  </span>

                  <button onClick={() => increaseQty(item.id)}>+</button>

                </div>

              )}


              <button
                className="btn"
                onClick={() =>
                  dispatch(addToCart({ ...item, quantity }))
                }
              >

                {isInCart(item.id) ? "Added ✓" : "Add To Cart"}

              </button>

            </div>

          );

        })}

      </div>


      

      <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", alignItems: "center"}}>

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          ◀
        </button>


        {[...Array(totalPages)].map((_, index) => (

          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            style={{
              margin: "5px",
              background: currentPage === index + 1 ? "#000" : "#eee",
              color: currentPage === index + 1 ? "#fff" : "#000"
            }}
          >
            {index + 1}
          </button>

        ))}


        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          ▶
        </button>

      </div>

    </div>

  );

}

export default Home;