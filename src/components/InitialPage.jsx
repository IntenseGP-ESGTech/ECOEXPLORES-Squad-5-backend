import React from "react";
import { useNavigate } from "react-router-dom"; // IMPORTAÇÃO AQUI
import "./InitialPage.css";
import fundo from "./fundo.jpg";

const InitialPage = () => {
  const navigate = useNavigate(); // NAVEGAÇÃO

  const inicialContainerStyle = {
    minHeight: "93.4vh",
    width: "96.9vw",
    backgroundImage: `radial-gradient(circle, #55B1E6CC, #26119DCC),
    url(${fundo})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    padding: "30px",
    position: "relative"
  };

 const playButtonStyle = {
  position: "absolute",
  top: "40px",
  right: "50px",
  padding: "20px 30px",
  backgroundColor: "#26119DCC", //  COR
  color: "#fff",                // Contraste com fundo escuro
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0px 0px 10px rgba(0,0,0,0.3)"
};

  const handlePlayClick = () => {
    navigate("/login"); //  REDIRECIONAMENTO PARA /login
  };

  return (
    <div style={inicialContainerStyle}>
      {/* Botão Play no canto superior direito */}
    <button className="play-button" onClick={handlePlayClick}>
  ▶ Iniciar
</button>

      <img
        src="/logo.png"
        alt="Logo"
        className="inicial-logo-externo"
      />
      <div className="inicial-box">
        <div className="inicial-left">
          {/* Conteúdo visual opcional */}
        </div>
      </div>
    </div>
  );
};

export default InitialPage;
