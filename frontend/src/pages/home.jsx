import { useEffect, useMemo, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import api from "../api/axios";
import FoodCard from "../components/FoodCard";
import Spinner from "../components/Spinner";

export default function Home() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [addingId, setAddingId] = useState(null);

  const loadFoods = async () => {
    setLoadingFoods(true);
    try {
      const res = await api.get("/foods");
      setFoods(res.data || []);
    } finally {
      setLoadingFoods(false);
    }
  };

  const loadCart = async () => {
    setLoadingCart(true);
    try {
      const res = await api.get("/cart");
      setCart(res.data || { items: [] });
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    loadFoods();
    loadCart();
  }, []);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const text = `${food.name} ${food.description} ${food.category}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [foods, query]);

  const cartItems = cart?.items || [];
  const cartCount = cartItems.reduce((a, b) => a + b.quantity, 0);
  const cartTotal = cartItems.reduce(
    (a, b) => a + b.price * b.quantity,
    0
  );

  const addToCart = async (foodId) => {
    setAddingId(foodId);
    try {
      await api.post("/cart/add", { foodId, quantity: 1 });
      await loadCart();
      setMessage("Added to cart ✔");
      setTimeout(() => setMessage(""), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-white p-4 relative overflow-hidden font-sans">

      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-action/5 blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">

        {/* TOP BAR */}
        <div className="p-6 rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>
            <p className="text-xs uppercase tracking-widest text-action">
              Food Ordering System
            </p>
            <h1 className="text-xl md:text-2xl font-bold">
              Welcome, {user?.name}
            </h1>
    
          </div>

          <div className="flex gap-2 flex-wrap">
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="px-4 py-2 rounded-xl bg-secondary/20 border border-secondary/30 text-sm"
              >
                Admin
              </button>
            )}

            <Link
              to="/checkout"
              className="px-4 py-2 rounded-xl bg-action text-sm font-semibold"
            >
              Cart ({cartCount})
            </Link>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl border border-red-400/40 text-red-300 text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        
        {/* SEARCH */}
        <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search food..."
            className="flex-1 bg-primary/40 border border-secondary/30 rounded-xl px-4 py-3 text-sm"
          />

          <Link
            to="/checkout"
            className="px-4 py-3 rounded-xl bg-action text-sm font-semibold"
          >
            Checkout
          </Link>
        </div>

        {message && (
          <div className="text-center text-xs text-green-400">{message}</div>
        )}

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* FOOD GRID */}
          <div className="lg:col-span-3">
            {loadingFoods ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl">
                <Spinner className="w-10 h-10 mb-2" color="text-action" />
                <p className="text-sm text-gray-400">Loading foods...</p>
              </div>
            ) : filteredFoods.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl">
                <p className="text-sm text-gray-400">No food items found.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredFoods.map((food) => (
                  <FoodCard
                    key={food._id}
                    food={food}
                    onAdd={() => addToCart(food._id)}
                    isLoading={addingId === food._id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* CART */}
          <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl h-fit">
            <h3 className="font-bold mb-3">Your Cart</h3>

            {loadingCart ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Spinner className="w-6 h-6 mb-2" color="text-action" />
                <p className="text-xs text-gray-400">Updating cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <p className="text-xs text-gray-400">Cart is empty</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.foodId} className="flex gap-3 text-xs">
                    <img
                      src={item.image}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p>{item.name}</p>
                      <p className="text-gray-400">
                        {item.quantity} × LKR {item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 border-t border-white/10 pt-3 flex justify-between text-sm">
              <span>Total</span>
              <span>LKR {cartTotal.toFixed(2)}</span>
            </div>

            <Link
              to="/checkout"
              className="block mt-4 text-center bg-action py-2 rounded-xl text-sm font-bold"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}