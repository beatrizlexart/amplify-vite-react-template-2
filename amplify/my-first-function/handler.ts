// Importa o axios para fazer as requisições HTTP
import axios from "axios";

export const handler = async (event: any) => {
  try {
    // O 'code' é enviado no corpo da requisição para o Lambda
    const { code } = JSON.parse(event.body);

    // Defina as variáveis do Instagram (esses valores você deve substituir pelos reais)
    const clientId = "571069375631067"; // Seu client_id do Instagram
    const clientSecret = "294ac10bfd8f72c6135bc498f8acc171"; // Seu client_secret do Instagram
    const redirectUri = "https://localhost:5173/auth/instagram/callback"; // O mesmo redirect_uri configurado

    // Realiza a requisição HTTP para o Instagram para obter o access_token
    const response = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      null,
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
          code: code,
        },
      }
    );

    // Retorna o access_token no formato JSON para o frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: response.data.access_token,
      }),
    };
  } catch (error) {
    console.error("Erro ao trocar código por token:", error);

    // Retorna um erro em caso de falha
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Erro ao trocar código por token",
      }),
    };
  }
};
