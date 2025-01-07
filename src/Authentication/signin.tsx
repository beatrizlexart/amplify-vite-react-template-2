import { useState, useEffect } from "react";
import { auth, googleProvider, facebookProvider } from "./config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { initializeGapiWithToken } from "../components/YoutubeUpload";
import { signOut } from "firebase/auth";

import "./index.css";

function Signin() {
  const [userGoogle, setUserGoogle] = useState<string | null>(null);
  const [userFacebook, setUserFacebook] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignInGoogle = () => {
    // Desloga primeiro (garantindo que o estado de login seja limpo)
    signOut(auth)
      .then(() => {
        // Inicializa o provedor do Google
        const googleProvider = new GoogleAuthProvider();

        // Adiciona os escopos necessários
        googleProvider.addScope(
          "https://www.googleapis.com/auth/youtube.upload"
        );
        googleProvider.addScope(
          "https://www.googleapis.com/auth/youtube.force-ssl"
        );
        googleProvider.addScope(
          "https://www.googleapis.com/auth/youtubepartner"
        );
        googleProvider.addScope("https://www.googleapis.com/auth/youtube");

        // Tenta o login com o popup
        signInWithPopup(auth, googleProvider)
          .then((result: any) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const accessToken = credential?.accessToken;

            if (accessToken) {
              console.log("Access Token: ", accessToken);
              localStorage.setItem("googleAuthToken", accessToken); // Armazenando o token

              // Inicializa o gapi com o token
              initializeGapiWithToken(accessToken);
            }

            // Pega o usuário autenticado
            const user = result.user;
            if (user?.email) {
              setUserGoogle(user.email); // Atualiza o estado do email
              navigate("/youtube-upload"); // Navega para a página de upload de vídeos
            }
          })
          .catch((error) => {
            console.error("Erro no login", error);
          });
      })
      .catch((error) => {
        console.error("Erro ao fazer logout", error);
      });
  };

  const handleSignInFacebook = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        const user = result.user;

        if (user.email) {
          setUserFacebook(user.email);
          localStorage.setItem("emailFacebook", user.email);
          navigate("/app");
        } else {
          console.error("Email not available");
        }
      })
      .catch((error) => {
        console.error("Error signing in:", error);
      });
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("emailGoogle");
    setUserGoogle(storedEmail); // Aqui 'storedEmail' pode ser string ou null
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("emailFacebook");
    setUserFacebook(storedEmail); // Aqui 'storedEmail' pode ser string ou null
  }, []);

  return (
    <div>
      <button className="google-btn" onClick={handleSignInGoogle}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Google_Plus_logo_%282015-2019%29.svg/640px-Google_Plus_logo_%282015-2019%29.svg.png"
          alt="Google"
        />
        Sign in with Google
      </button>
      <button className="facebook-btn" onClick={handleSignInFacebook}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
          alt="Facebook"
        />
        Sign in with Facebook
      </button>
      {/* Para o TikTok, como a API não oferece diretamente um botão, você pode criar um botão personalizado */}
      <button
        className="tiktok-btn"
        onClick={() => alert("TikTok login not yet implemented")}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Ionicons_logo-tiktok.svg/640px-Ionicons_logo-tiktok.svg.png"
          alt="TikTok"
        />
        Sign in with TikTok
      </button>
    </div>
  );
}

export default Signin;
