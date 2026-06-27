import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function Home() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Food Ordering App 🍔</h1>

      <p>Welcome: {user?.name}</p>
      <p>Role: {user?.role}</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}