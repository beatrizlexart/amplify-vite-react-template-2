import { useState, useEffect } from "react";
import { auth, facebookProvider } from "./config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { initializeGapiWithToken } from "../components/YoutubeUpload";
import { signOut } from "firebase/auth";
import "./index.css";

function Signin() {
  const [userGoogle, setUserGoogle] = useState<string | null>(null);
  const [userFacebook, setUserFacebook] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log(userGoogle);
  console.log(userFacebook);

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

  const handleSignInInstagram = () => {
    signInWithPopup(auth, facebookProvider) // Firebase sign-in with Facebook
      .then((result) => {
        const user = result.user;

        if (user.email) {
          // Store the user's email for further use
          setUserFacebook(user.email);
          localStorage.setItem("emailFacebook", user.email);

          // After Facebook login, initiate Instagram OAuth flow
          // Redirect the user to Instagram for authentication
          const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=571069375631067&redirect_uri=https://localhost:5173/auth/instagram/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish`;

          // Redirect to Instagram login page
          window.location.href = instagramAuthUrl;
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
      <button className="facebook-btn" onClick={handleSignInInstagram}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/640px-Instagram_logo_2022.svg.png"
          alt="Instagram"
        />
        Sign in with Instagram
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
