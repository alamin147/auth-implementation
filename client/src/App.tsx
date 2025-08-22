import "./App.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getUserInfo } from "./redux/authUlits";

function App() {
  const user = getUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/signin");
    }
  }, [user, navigate]);

  return (
    <div className="App min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome</h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}

export default App;
