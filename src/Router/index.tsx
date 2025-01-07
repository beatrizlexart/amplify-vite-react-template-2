import { Route, Routes } from "react-router-dom";
import SignIn from "../Authentication/signin"; // Página de login
import App from "../App"; // Página principal após o login
import YoutubeUpload from "../components/YoutubeUpload";

function AppRouter() {
  return (
    <Routes>
      {/* Definindo as rotas */}
      <Route path="/signin" element={<SignIn />} /> {/* Página de login */}
      <Route path="/youtube-upload" element={<YoutubeUpload />} />
      {/* Página de cadastro */}
      <Route path="/app" element={<App />} />{" "}
      {/* Página principal após o login */}
      <Route path="/" element={<SignIn />} /> {/* Página padrão para login */}
    </Routes>
  );
}

export default AppRouter;
