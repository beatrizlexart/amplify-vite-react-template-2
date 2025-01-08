import express from "express";
import bodyParser from "body-parser";
import { eventContext } from "aws-serverless-express/middleware.js";
import { post } from "axios";

// Declara um novo aplicativo Express
const app = express();
app.use(bodyParser.json());
app.use(eventContext());

// Habilita o CORS para todos os métodos
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Permite qualquer origem
  res.header("Access-Control-Allow-Headers", "*"); // Permite todos os cabeçalhos
  next();
});

/**********************
 * Exemplo de método GET *
 **********************/
app.get("/dev", function (req, res) {
  res.json({ success: "get call succeed!", url: req.url });
});

app.get("/dev/*", function (req, res) {
  res.json({ success: "get call succeed!", url: req.url });
});

/****************************
 * Exemplo de método POST (Instagram Code Exchange) *
 ****************************/
app.post("/auth/instagram", async (req, res) => {
  const { code } = req.body;

  // Variáveis do Instagram (substitua com os valores reais)
  const clientId = "571069375631067"; // Seu client_id do Instagram
  const clientSecret = "294ac10bfd8f72c6135bc498f8acc171"; // Seu client_secret do Instagram
  const redirectUri = "https://localhost:5173/auth/instagram/callback"; // O mesmo redirect_uri configurado

  try {
    // Realiza a requisição HTTP para o Instagram para obter o access_token
    const response = await post(
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
    res.status(200).json({
      access_token: response.data.access_token,
    });
  } catch (error) {
    console.error("Erro ao trocar código por token:", error);

    // Formatação personalizada do erro
    res.status(500).json({
      error: "Erro ao trocar código por token",
      message: error.message, // Inclui a mensagem do erro real
      code: error.code || "INTERNAL_SERVER_ERROR", // Caso exista algum código de erro
    });
  }
});

/****************************
 * Exemplo de método PUT *
 ****************************/
app.put("/dev", function (req, res) {
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

app.put("/dev/*", function (req, res) {
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

/****************************
 * Exemplo de método DELETE *
 ****************************/
app.delete("/dev", function (req, res) {
  res.json({ success: "delete call succeed!", url: req.url });
});

app.delete("/dev/*", function (req, res) {
  res.json({ success: "delete call succeed!", url: req.url });
});

// Exporta o app. Quando executado localmente, isso não faz nada. Porém, para portá-lo para o AWS Lambda,
// vamos criar um "wrapper" ao redor do qual vai carregar o app.
export default app;
