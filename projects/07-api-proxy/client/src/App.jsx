import Login from "./components/Login";
import Chat from "./components/Chat";
import useAuthStore from "./store/authStore";

function App() {
  // 从 Zustand store 中获取认证状态
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // 获取用户信息
  const user = useAuthStore((state) => state.user);

  return (
    <div className="App">
      {/* 根据认证状态显示不同页面 */}
      {isAuthenticated && user ? <Chat /> : <Login />}
    </div>
  );
}

export default App;
