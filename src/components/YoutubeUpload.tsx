import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Authentication/config";
import { gapi } from "gapi-script";

import "./index.css";

// Função para inicializar o gapi com o token do Firebase

export const initializeGapiWithToken = (accessToken: string) => {
  console.log("Iniciando o gapi com token:", accessToken);

  gapi.load("client:auth2", () => {
    gapi.client
      .init({
        apiKey: "AIzaSyDHr4_1YCvBXVT5rh30JKtbdLCpQSXhqeA", // Substitua pela sua chave de API
        clientId:
          "974460317774-dsburldair8jk8pj57lpq9507fhf98is.apps.googleusercontent.com", // Substitua pelo seu Client ID
        scope:
          "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtube",
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
        ],
      })
      .then(() => {
        // Define o token de autenticação no gapi
        gapi.auth.setToken({
          access_token: accessToken,
        });

        console.log("GAPI inicializado e token configurado!");
      })
      .catch((error: any) => {
        console.error("Erro ao inicializar o gapi:", error);
      });
  });
};

function YoutubeUpload() {
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDescription, setVideoDescription] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  useEffect(() => {
    const googleAuthToken = localStorage.getItem("googleAuthToken");
    if (googleAuthToken) {
      initializeGapiWithToken(googleAuthToken); // Inicialize o gapi com o token do Google
    } else {
      setUploadStatus("Token de autenticação não encontrado.");
    }
  }, []);

  const navigate = useNavigate();

  const signOutRedirect = () => {
    // Desloga do Firebase
    signOut(auth)
      .then(() => {
        // Desloga do Google com o gapi
        const googleAuth = gapi.auth2.getAuthInstance();
        if (googleAuth.isSignedIn.get()) {
          googleAuth.signOut(); // Garantir que o Google está deslogado
        }

        // Limpa o token do Google e outros dados persistentes
        localStorage.removeItem("googleAuthToken");
        sessionStorage.clear();

        // Redireciona para a página de login
        navigate("/signin");
      })
      .catch((error: any) => {
        console.error("Erro ao fazer logout", error);
      });
  };

  //   const uploadVideoToYoutube = async (
  //     videoFile: File,
  //     title: string,
  //     description: string
  //   ) => {
  //     const googleAuthToken = localStorage.getItem("googleAuthToken");

  //     if (!googleAuthToken) {
  //       setUploadStatus("Token de autenticação não encontrado.");
  //       console.error("Token de autenticação não encontrado.");
  //       return;
  //     }

  //     // Set the token for the gapi client
  //     gapi.auth.setToken({
  //       access_token: googleAuthToken,
  //     });

  //     // Prepare the video metadata
  //     const videoMetadata = {
  //       snippet: {
  //         title: title,
  //         description: description,
  //         tags: ["example", "video"],
  //         // categoryId: "22",
  //       },
  //       status: {
  //         privacyStatus: "public", // Change to 'public' if needed
  //       },
  //     };

  //     try {
  //       // Step 1: Send request to YouTube API to insert video metadata
  //       const uploadRequest = {
  //         path: "/upload/youtube/v3/videos",
  //         method: "POST",
  //         params: {
  //           part: "id,snippet,status",
  //           notifySubscribers: "true",
  //         },
  //         headers: {
  //           Authorization: `Bearer ${googleAuthToken}`, // Include the access token here
  //           "Content-Type": "video/*, application/octet-stream",
  //         },
  //         body: JSON.stringify(videoMetadata), // Video metadata (title, description, etc.)
  //       };

  //       const uploadResponse = await gapi.client.request(uploadRequest);

  //       if (uploadResponse.status !== 200) {
  //         throw new Error("Error uploading video metadata.");
  //       }

  //       // Get the upload URL from the response
  //       const uploadUrl = uploadResponse.result.uploadUrl; // This is where the video file will be uploaded
  //       console.log("Video metadata uploaded. Now uploading video file...");

  //       // Step 2: Upload the actual video file to YouTube
  //       const mediaRequest = {
  //         path: uploadUrl, // This URL is provided by the uploadResponse
  //         method: "PUT",
  //         body: videoFile, // The actual video file content
  //         headers: {
  //           Authorization: `Bearer ${googleAuthToken}`,
  //           "Content-Type": "video/*, application/octet-stream", // Ensure the correct MIME type
  //         },
  //       };

  //       // Make the request to upload the video file
  //       const mediaResponse = await gapi.client.request(mediaRequest);

  //       if (mediaResponse.status === 200) {
  //         console.log("Upload bem-sucedido", mediaResponse);
  //         setUploadStatus("Upload realizado com sucesso!");
  //       } else {
  //         console.error("Erro no upload do vídeo", mediaResponse);
  //         setUploadStatus("Erro ao fazer upload do vídeo.");
  //       }
  //     } catch (error) {
  //       console.error("Erro ao realizar o upload:", error);
  //       setUploadStatus("Erro ao fazer upload do vídeo.");
  //     }
  //   };

  const uploadVideoToYoutube = async (
    videoFile: File,
    title: string,
    description: string
  ) => {
    const googleAuthToken = localStorage.getItem("googleAuthToken");

    if (!googleAuthToken) {
      setUploadStatus("Token de autenticação não encontrado.");
      console.error("Token de autenticação não encontrado.");
      return;
    }

    const videoMetadata = {
      snippet: {
        title: title,
        description: description,
        tags: ["example", "video"],
        categoryId: "22",
      },
      status: {
        privacyStatus: "public",
      },
    };

    try {
      const formData = new FormData();
      formData.append(
        "metadata",
        new Blob([JSON.stringify(videoMetadata)], { type: "application/json" })
      );
      formData.append("file", videoFile);

      const response = await fetch(
        "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${googleAuthToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Erro: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Vídeo enviado com sucesso:", result);
      setUploadStatus("Upload Successful");
    } catch (error) {
      console.error("Erro ao enviar vídeo:", error);
      setUploadStatus("Upload Failed");
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !videoTitle || !videoDescription) {
      setUploadStatus("Por favor, preencha todos os campos.");
      return;
    }

    setUploadStatus("Iniciando o upload...");

    try {
      await uploadVideoToYoutube(videoFile, videoTitle, videoDescription);
    } catch (error: any) {
      setUploadStatus(error);
    }
  };

  return (
    <main>
      <div className="form-container">
        <h3>Upload a Video to YouTube</h3>

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

export default YoutubeUpload;
