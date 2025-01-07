import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Importando o BrowserRouter
import AppRouter from "./Router/index"; // A nossa configuração de rotas (AppRouter.tsx)
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

// Configuração do Amplify
Amplify.configure(outputs);

// Renderizando a aplicação com o Router
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRouter /> {/* O AppRouter gerencia as rotas */}
    </BrowserRouter>
  </React.StrictMode>
);
