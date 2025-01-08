import { signOut } from "firebase/auth";

import { auth } from "./Authentication/config";

import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const signOutRedirect = () => {
    signOut(auth) // Usando a função signOut do Firebase Auth corretamente
      .then(() => {
        navigate("/signin"); // Limpa o estado do usuário após o logout
      })
      .catch((error: any) => {
        console.error("Erro ao fazer logout: ", error);
      });
  };

  return (
    <div>
      <main>
        <h1>My todos</h1>
        <button onClick={signOutRedirect} className="logout-btn">
          Logout
        </button>
      </main>
    </div>
  );
}

export default App;
