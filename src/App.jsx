

import React from 'react';
// Componentes de roteamento do React Router DOM v6
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importação de componentes de página
import  InitialPage  from './components/InitialPage';  // Página inicial
import LoginPage  from './components/LoginPage';      // Página de login
import  PreCadastro  from './components/PreCadastro';
import  CadastroEscola  from './components/CadastroEscola'; // Ajuste o caminho conforme sua estrutura
import  CadastroProfessor  from './components/CadastroProfessor'; // Formulário professor
import CadastroResponsavel  from './components/CadastroResponsavel'; // Formulário responsável
import  CadastroAluno  from './components/CadastroAluno';      // Formulário aluno
import  Home  from './components/Home';                        // Dashboard principal





/**
 * Componente principal que define a estrutura de rotas da aplicação
 * @returns {JSX.Element} Estrutura de roteamento da aplicação
 */
function App() {
  return (
    
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<InitialPage />} />   {/* Página inicial */}
        <Route path="/login" element={<LoginPage />} /> {/* Página de login */}
         <Route path="/pre-cadastro" element={<PreCadastro />} />
          <Route path="/cadastro-escola" element={<CadastroEscola />} />
           <Route path="/cadastro/professor" element={<CadastroProfessor />} />
           <Route path="/cadastro/responsavel" element={<CadastroResponsavel />} />
           <Route path="/cadastro/aluno" element={<CadastroAluno />} />
           <Route path="/home" element={<Home />} /> 
          
           
          
          
         
      </Routes>
    </Router>
  );
}

export default App;
