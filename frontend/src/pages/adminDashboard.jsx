import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Spinner from "../components/Spinner";

/* ────────────────────────────────
   CONSTANTS
──────────────────────────────── */
const ORDER_STATUSES = [
  "Pending",
  "Preparing",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

function StatusBadge({ label }) {
  const colors = {
    Paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    Pending: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    Failed: "bg-red-500/10 text-red-400 border-red-500/30",
    Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    Preparing: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    "Out For Delivery": "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  };

  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full border uppercase ${
      colors[label] || "bg-white/5 text-white/70 border-white/10"
    }`}>
      {label}
    </span>
  );
}

/* ────────────────────────────────
   MAIN ADMIN DASHBOARD
──────────────────────────────── */
export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState("orders");

  const [editingFood, setEditingFood] = useState(null);

  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Burger",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  /* ────────────────────────────────
     LOAD DATA
  ──────────────────────────────── */
  const loadData = async () => {
    setLoading(true);
    try {
      const [o, f] = await Promise.all([
        api.get("/orders"),
        api.get("/foods"),
      ]);

      setOrders(o.data || []);
      setFoods(f.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ────────────────────────────────
     UPDATE ORDER STATUS
  ──────────────────────────────── */
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  /* ────────────────────────────────
     DELETE FOOD
  ──────────────────────────────── */
  const deleteFood = async (id) => {
    if (!confirm("Are you sure you want to delete this food item?")) return;
    try {
      await api.delete(`/foods/${id}`);
      setFoods((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete food item");
    }
  };

  /* ────────────────────────────────
     ADD FOOD
  ──────────────────────────────── */
  const addFood = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("category", form.category);
      if (imageFile) fd.append("image", imageFile);

      await api.post("/foods", fd);

      setForm({ name: "", description: "", price: "", category: "Burger" });
      setImageFile(null);
      setPreview("");

      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add food item");
    } finally {
      setSubmitting(false);
    }
  };

  /* ────────────────────────────────
     EDIT FOOD
  ──────────────────────────────── */
  const startEdit = (food) => {
    setEditingFood(food);
    setForm({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
    });
    setPreview(food.image || "");
  };

  const saveEdit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("category", form.category);

      if (imageFile) fd.append("image", imageFile);

      await api.put(`/foods/${editingFood._id}`, fd);

      setEditingFood(null);
      setForm({ name: "", description: "", price: "", category: "Burger" });
      setImageFile(null);
      setPreview("");

      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update food item");
    } finally {
      setSubmitting(false);
    }
  };

  /* ────────────────────────────────
     UI (HOME STYLE)
  ──────────────────────────────── */
  return (
    <div className="min-h-screen bg-primary text-white p-4 relative overflow-hidden">

      {/* background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-action/5 blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="p-6 rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl flex justify-between">
          <div>
            <p className="text-xs text-action uppercase">Admin Panel</p>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>

          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-action text-black font-semibold"
          >
            Customer View
          </Link>
        </div>

        {/* TABS */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab("orders")}
            className={`px-4 py-2 rounded-xl ${
              tab === "orders"
                ? "bg-action text-black"
                : "bg-white/5 border border-white/10"
            }`}
          >
            Orders
          </button>

          <button
            onClick={() => setTab("foods")}
            className={`px-4 py-2 rounded-xl ${
              tab === "foods"
                ? "bg-action text-black"
                : "bg-white/5 border border-white/10"
            }`}
          >
            Foods
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl">
            <Spinner className="w-12 h-12 mb-3" color="text-action" />
            <p className="text-gray-400">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* ───────────────── ORDERS ───────────────── */}
            {tab === "orders" && (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o._id}
                    className="p-5 rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl grid md:grid-cols-4 gap-4"
                  >
                    {/* CUSTOMER DETAILS */}
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-white">
                        👤 {o.userId?.name}
                      </p>
                      <p className="text-gray-400">📧 {o.userId?.email}</p>
                      <p className="text-gray-400">📞 {o.phone}</p>
                      <p className="text-gray-400">📍 {o.deliveryAddress}</p>
                      
                    </div>

                    {/* PAYMENT + STATUS */}
                    <div className="flex flex-col gap-2">
                      <StatusBadge label={o.paymentStatus} />
                      <StatusBadge label={o.orderStatus} />
                      <p className="font-bold mt-1">
                        LKR {o.totalAmount}
                      </p>
                    </div>

                    {/* ITEMS */}
                    <div className="text-xs text-gray-300">
                      {o.items?.map((i, idx) => (
                        <p key={idx}>
                          {i.name} × {i.quantity}
                        </p>
                      ))}
                    </div>

                    {/* UPDATE STATUS */}
                    <div>
                      <select
                        className="w-full p-2 rounded-xl bg-primary/40 border border-secondary/30"
                        value={o.orderStatus}
                        onChange={(e) =>
                          updateStatus(o._id, e.target.value)
                        }
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ───────────────── FOODS ───────────────── */}
            {tab === "foods" && (
              <div className="space-y-6">

                {/* ADD / EDIT FOOD */}
                <div className="p-6 rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl space-y-3">
                  <h2 className="font-bold">
                    {editingFood ? "Edit Food" : "Add Food"}
                  </h2>

                  <input
                    className="w-full p-3 rounded-xl bg-primary/40 border border-secondary/30"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />

                  <input
                    className="w-full p-3 rounded-xl bg-primary/40 border border-secondary/30"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />

                  <input
                    className="w-full p-3 rounded-xl bg-primary/40 border border-secondary/30"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />

                  <input
                    className="w-full p-3 rounded-xl bg-primary/40 border border-secondary/30"
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  />

                  <div
                    onClick={() => fileRef.current.click()}
                    className="h-28 flex items-center justify-center rounded-xl bg-primary/40 border border-secondary/30 cursor-pointer"
                  >
                    {preview ? (
                      <img
                        src={preview}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      "Upload Image"
                    )}
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setImageFile(file);
                      setPreview(URL.createObjectURL(file));
                    }}
                  />

                  <button
                    onClick={editingFood ? saveEdit : addFood}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl bg-action text-black font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {submitting ? (
                      <>
                        <Spinner className="w-5 h-5" color="text-black" />
                        {editingFood ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      editingFood ? "Update Food" : "Add Food"
                    )}
                  </button>
                </div>

                {/* FOOD LIST */}
                <div className="grid md:grid-cols-3 gap-4">
                  {foods.map((f) => (
                    <div
                      key={f._id}
                      className="p-4 rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl"
                    >
                      <img
                        src={f.image}
                        className="h-32 w-full object-cover rounded-xl"
                      />

                      <p className="font-bold mt-2">{f.name}</p>
                      <p className="text-xs text-gray-400">{f.category}</p>

                      <p className="mt-1 font-bold">
                        LKR {f.price}
                      </p>

                      {/* EDIT + DELETE */}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => startEdit(f)}
                          className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() => deleteFood(f._id)}
                          className="flex-1 px-3 py-2 rounded-xl border border-red-400/40 text-red-300 text-sm"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}