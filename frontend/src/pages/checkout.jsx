import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState({ items: [] });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    deliveryAddress: "",
    phone: "",
  });
  const loadCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data || { items: [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load cart");
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQty = async (foodId, quantity) => {
    if (quantity <= 0) {
      await handleRemove(foodId);
      return;
    }
    try {
      await api.put("/cart/update", { foodId, quantity });
      await loadCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (foodId) => {
    try {
      await api.delete(`/cart/${foodId}`);
      await loadCart();
      toast.success("Item removed 🗑");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    }
  };

  const cartItems = cart?.items || [];

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      const orderRes = await api.post("/orders", {
        deliveryAddress: form.deliveryAddress,
        phone: form.phone,
        paymentMethod,
      });

      const order = orderRes.data.order;

      if (paymentMethod === "COD") {
        toast.success("Order placed successfully! 🎉");
        navigate("/payment-success", {
          state: { orderId: order._id, paymentMethod: "COD" },
        });
        return;
      }

      const payRes = await api.post("/payment/initialize", {
        orderId: order._id,
      });

      const paymentPayload = payRes.data.payment;

      if (!window.payhere) {
        throw new Error("PayHere SDK is not loaded");
      }

      let paymentCompleted = false;

      window.payhere.onCompleted = async () => {
        paymentCompleted = true;

        try {
          await api.post("/payment/confirm", { orderId: order._id });
        } catch (err) {
          console.warn("Payment confirm call failed:", err.message);
          
        }

        toast.success("Payment completed successfully! 💳");
        navigate("/payment-success", {
          state: { orderId: order._id, paymentMethod: "PAYHERE" },
        });
      };

      window.payhere.onDismissed = () => {
        setTimeout(() => {
          if (!paymentCompleted) {
            toast.error("Payment was cancelled.");
            navigate("/payment-cancel", {
              state: { orderId: order._id },
            });
          }
        }, 1500);
      };

      window.payhere.onError = (error) => {
        toast.error(error || "Payment error");
      };

      window.payhere.startPayment(paymentPayload);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-white p-4 relative overflow-hidden font-sans">

      {/* Background blobs (HOME STYLE) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-action/5 blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="p-6 rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <p className="text-xs uppercase tracking-widest text-action">
              Checkout
            </p>
            <h1 className="text-xl md:text-2xl font-bold">
              Complete your order
            </h1>
            <p className="text-sm text-gray-400">
              Logged in as {user?.name}
            </p>
          </div>

          <button
            className="px-4 py-2 rounded-xl bg-secondary/20 border border-secondary/30 text-sm"
            onClick={() => navigate("/")}
          >
            Back to menu
          </button>
        </div>



        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT - FORM */}
          <section className="lg:col-span-7 p-6 rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl space-y-5">

            <h2 className="text-lg font-bold">Delivery Details</h2>

            <textarea
              className="w-full p-3 rounded-xl bg-primary/40 border border-secondary/30 text-sm"
              rows="4"
              value={form.deliveryAddress}
              onChange={(e) =>
                setForm({ ...form, deliveryAddress: e.target.value })
              }
              placeholder="Enter delivery address"
            />

            <input
              className="w-full p-3 rounded-xl bg-primary/40 border border-secondary/30 text-sm"
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              placeholder="Phone number"
            />

            {/* PAYMENT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">

              <label className={`p-4 rounded-2xl border cursor-pointer transition ${
                paymentMethod === "COD"
                  ? "bg-action/10 border-action text-white"
                  : "bg-white/5 border-white/10 text-gray-300"
              }`}>
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                Cash on Delivery
              </label>

              <label className={`p-4 rounded-2xl border cursor-pointer transition ${
                paymentMethod === "PAYHERE"
                  ? "bg-action/10 border-action text-white"
                  : "bg-white/5 border-white/10 text-gray-300"
              }`}>
                <input
                  type="radio"
                  value="PAYHERE"
                  checked={paymentMethod === "PAYHERE"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                PayHere Sandbox
              </label>

            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || cartItems.length === 0}
              className="w-full mt-4 py-3 rounded-xl bg-action text-black font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Spinner className="w-5 h-5" color="text-black" />
                  Processing...
                </>
              ) : paymentMethod === "PAYHERE" ? (
                "Pay with PayHere"
              ) : (
                "Place Order"
              )}
            </button>
          </section>

          {/* RIGHT - SUMMARY */}
          <aside className="lg:col-span-5 p-6 rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl space-y-5">

            <h2 className="text-lg font-bold">Order Summary</h2>

            {cartItems.length === 0 ? (
              <div className="p-6 text-center text-gray-400 border border-dashed border-white/10 rounded-xl">
                No items in cart
              </div>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto">
                 {cartItems.map((item) => (
                  <div
                    key={item.foodId || item._id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-primary/40 border border-secondary/30"
                  >
                    <img
                      src={item.image}
                      className="w-12 h-12 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={() => handleUpdateQty(item.foodId, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-secondary/30 hover:bg-secondary/50 text-white font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold text-white">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(item.foodId, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-secondary/30 hover:bg-secondary/50 text-white font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-action">
                        LKR {(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemove(item.foodId)}
                        className="text-xs text-red-400 hover:text-red-300 mt-1 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-white/10 pt-4 flex justify-between">
              <span className="text-gray-300">Total</span>
              <span className="font-bold text-lg text-white">
                LKR {totalAmount.toFixed(2)}
              </span>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}