import Spinner from "./Spinner";

export default function FoodCard({ food, onAdd, isLoading }) {
  return (
    <div className="rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl overflow-hidden hover:scale-[1.02] transition">

      <img
        src={food.image}
        alt={food.name}
        className="w-full h-40 object-cover"
      />

      <div className="p-4 space-y-2">

        <p className="text-xs text-action uppercase tracking-widest">
          {food.category || "Food"}
        </p>

        <h3 className="font-bold">{food.name}</h3>

        <p className="text-xs text-gray-400 line-clamp-2">
          {food.description}
        </p>

        <div className="flex justify-between items-center mt-2">
          <span className="font-bold text-sm">
            LKR {Number(food.price).toFixed(2)}
          </span>

          <button
            onClick={onAdd}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl bg-action text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-50 disabled:pointer-events-none min-w-[52px]"
          >
            {isLoading ? <Spinner className="w-3.5 h-3.5" color="text-white" /> : "Add"}
          </button>
        </div>

      </div>
    </div>
  );
}