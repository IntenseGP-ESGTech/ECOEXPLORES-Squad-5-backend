// src/components/PreCadastro.jsx
import './PreCadastro.css';
import fundo from './fundo.jpg'; // Importando a imagem do fundo
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; //  IMPORTAR O HOOK

export default function PreCadastro() {
  const categorias = ['Escola', 'Professor', 'Responsável', 'Aluno'];
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const navigate = useNavigate(); // ✅ Declara o hook aqui

 const handleSelecionarCategoria = (categoria) => {
  setCategoriaSelecionada((prev) => (prev === categoria ? '' : categoria));

  switch (categoria) {
    case 'Escola':
      navigate('/cadastro-escola');
      break;
    case 'Professor':
      navigate('/cadastro/professor'); // Corrigido
      break;
    case 'Responsável':
      navigate('/cadastro/responsavel'); // Corrigido
      break;
    case 'Aluno':
      navigate('/cadastro/aluno'); // Corrigido
      break;
    default:
      break;
  }
};


  return (
    <main style={{ backgroundImage: `radial-gradient(circle, #55B1E6CC, #26119DCC), url(${fundo})`, backgroundSize: 'cover', backgroundPosition: 'center' , }}>
      {/* Seção da esquerda com imagens */}
      <button className="botaoVoltarTopo" onClick={() => navigate('/login')}>
   Voltar
</button>
      <section className="esquerda">
        <img className="logoPreCadastro" src="/logo.png" alt="logo" />
        <img className="pessoas" src="/pessoas.png" alt="pessoas" />
      </section>

      {/* Seção da direita com a tabela de seleção */}
      <section className="direita">
        <img className="img_mundo" src="/mundo.png" alt="mundo" />
        <div className="tabelaCategoria">
          <h2>Agora Selecione sua Categoria</h2>
          {categorias.map((categoria) => (
            <button
              key={categoria}
              className={`botao-categoria ${categoriaSelecionada === categoria ? 'selecionado' : ''}`}
              onClick={() => handleSelecionarCategoria(categoria)}
            >
              <img
                src={categoriaSelecionada === categoria ? '/confirmacao.png' : '/circulo.png'}
                alt="ícone de seleção"
                className="icone_selecao"
              />
              <span>{categoria}</span>
            </button>
            
          ))}
        </div>
      </section>
    </main>
  );
}