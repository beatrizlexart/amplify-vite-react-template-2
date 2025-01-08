import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Authentication/config";

function InstagramUpload() {
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDescription, setVideoDescription] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null); // User ID for Instagram
  const navigate = useNavigate();

  const signOutRedirect = () => {
    signOut(auth)
      .then(() => {
        navigate("/signin");
      })
      .catch((error: any) => {
        console.error("Erro ao fazer logout: ", error);
      });
  };

  // Função para trocar o código de autorização por um token de acesso
  const exchangeCodeForAccessToken = (code: string) => {
    const apiUrl =
      "https://kgpwpxx6zb.execute-api.us-east-2.amazonaws.com/dev/dev/auth/instagram"; // Substitua pela URL do seu endpoint no API Gateway

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }), // Envia o código para a Lambda
    })
      .then((response) => {
        console.log("Resposta da Lambda:", response);
        if (!response.ok) {
          throw new Error(
            `Erro HTTP: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        if (data.access_token) {
          // Armazenar o access_token no localStorage ou em algum estado
          localStorage.setItem("instagramAccessToken", data.access_token);
          fetchInstagramUserData(data.access_token); // Chama a função para buscar dados do usuário
        } else {
          setUploadStatus("Erro ao obter o token de acesso.");
        }
      })
      .catch((error) => {
        console.error("Erro ao trocar código por token:", error);
        setUploadStatus("Erro ao trocar código por token.");
      });
  };

  // Função para buscar os dados do usuário do Instagram após obter o token
  const fetchInstagramUserData = (accessToken: string) => {
    fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUserId(data.id); // Salvar o ID do usuário do Instagram
          console.log("ID do usuário do Instagram:", data.id);
        } else {
          setUploadStatus("Erro ao buscar dados do Instagram.");
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar dados do Instagram:", error);
        setUploadStatus("Erro ao buscar dados do Instagram.");
      });
  };

  // Função para iniciar o upload do vídeo
  const startVideoUpload = (accessToken: string) => {
    if (!videoFile) {
      setUploadStatus("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video_url", videoFile);
    formData.append("caption", videoDescription);
    formData.append("access_token", accessToken);

    fetch(`https://graph.instagram.com/v15.0/${userId}/media`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          const mediaId = data.id;
          setUploadStatus("Upload session started.");
          publishVideo(mediaId, accessToken);
        } else {
          setUploadStatus("Failed to start upload session.");
        }
      })
      .catch((error) => {
        console.error("Error starting upload session:", error);
        setUploadStatus("Error starting upload session.");
      });
  };

  // Função para publicar o vídeo
  const publishVideo = (mediaId: string, accessToken: string) => {
    fetch(`https://graph.instagram.com/v15.0/${userId}/media_publish`, {
      method: "POST",
      body: JSON.stringify({
        creation_id: mediaId,
        access_token: accessToken,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUploadStatus(`Video published successfully. Video ID: ${data.id}`);
        } else {
          setUploadStatus("Failed to publish video.");
        }
      })
      .catch((error) => {
        console.error("Error publishing video:", error);
        setUploadStatus("Error publishing video.");
      });
  };

  // Função de envio do formulário (handleUpload)
  const handleUpload = () => {
    const accessToken = localStorage.getItem("instagramAccessToken");
    if (accessToken && userId) {
      startVideoUpload(accessToken);
    } else {
      setUploadStatus("Access token or user ID is missing.");
    }
  };

  // Capturar o código do Instagram na URL e trocar por token
  useEffect(() => {
    console.log("caiu no useeffect");
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      console.log("Code:", code);
      exchangeCodeForAccessToken(code);
    }
  }, []);

  return (
    <main>
      <div className="form-container">
        <h3>Upload a Video to Instagram</h3>

        <label>Video Title:</label>
        <input
          type="text"
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          placeholder="Enter video title"
        />
        <label>Video Description:</label>
        <textarea
          value={videoDescription}
          onChange={(e) => setVideoDescription(e.target.value)}
          placeholder="Enter video description"
        />
        <label>Choose Video File:</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
        />
        <button onClick={handleUpload}>Upload Video</button>
        {uploadStatus && (
          <p
            className={`status-message ${
              uploadStatus.includes("successful") ? "success" : "error"
            }`}
          >
            {uploadStatus}
          </p>
        )}
      </div>

      <button onClick={signOutRedirect} className="logout-btn">
        Logout
      </button>
    </main>
  );
}

export default InstagramUpload;
