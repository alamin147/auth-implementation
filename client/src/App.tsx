import "./App.css";
import { getUserInfo } from "./redux/authUlits";
function App() {
  const user = getUserInfo();
  console.log(user);
  if (!user) {
    return <div>Please sign in</div>;
  }
  return <div className="App">THis is app</div>;
}

export default App;
