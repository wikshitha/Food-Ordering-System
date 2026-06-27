import { Link, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">

      {/* background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-action/5 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">

        <div className="p-6 sm:p-8 rounded-2xl bg-secondary/10 border border-secondary/25 backdrop-blur-xl text-center flex flex-col gap-6 items-center animate-fade-in shadow-lg shadow-black/20">

          {/* ICON */}
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-3xl text-green-400 shadow-md">
            ✓
          </div>

          {/* TEXT */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-green-400">
              Payment Successful
            </p>

            <h1 className="text-xl md:text-2xl font-bold">
              Order Confirmed!
            </h1>

            <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
              Your payment was processed successfully. Your order is now being prepared!
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">

            <Link
              to="/"
              className="flex-1 py-3 rounded-xl bg-action text-black font-semibold hover:opacity-90 transition text-center"
            >
              Back to Menu
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}