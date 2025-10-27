// src/components/CadastroAluno.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

// Assets
import logo from '../assets/logo.png';
import mundo from '../assets/mundo.png';
import planeta from '../assets/planeta.png'; // Alterado para planeta

// Styles
import './CadastroAluno.css';

export default function CadastroAluno() {
    const [nome, setNome] = useState('');
    const [matricula, setMatricula] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/Home');
    };

    const handleVoltar = (e) => {
        e.preventDefault();
        navigate('/pre-cadastro');
    };

    return (
        <div className="container">
            <img src={logo} alt="Logo da plataforma" className="logoAluno" />
            <img src={mundo} alt="Elemento decorativo superior" className="mundoAluno" />
            <img src={planeta} alt="Elemento decorativo inferior" className="mundoBaixo" /> {/* Alterado para planeta */}

            <div className="loginBox">
                <div className="welcomeContainer">
                    <h1 className="welcomeTitle">Seja Bem Vindo!</h1>
                    <p className="welcomeSubtitle">Crie sua conta, leva menos de um minuto!</p>

                    <form className="formContainer">
                        <div className="inputGroup">
                            <label htmlFor="nome">Aluno</label>
                            <input
                                type="text"
                                id="nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Digite seu nome completo"
                                className="inputField"
                            />
                        </div>

                        <div className="inputGroup">
                            <label htmlFor="matricula">Matrícula</label>
                            <input
                                type="text"
                                id="matricula"
                                value={matricula}
                                onChange={(e) => setMatricula(e.target.value)}
                                placeholder="Digite sua matrícula"
                                className="inputField"
                            />
                        </div>

                        <div className="inputGroup">
                            <label htmlFor="senha">Defina sua Senha</label>
                            <input
                                type="password"
                                id="senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Crie uma senha segura"
                                className="inputField"
                            />
                        </div>

                        <div className="inputGroup">
                            <label htmlFor="confirmarSenha">Repita sua Senha</label>
                            <input
                                type="password"
                                id="confirmarSenha"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                placeholder="Repita a senha"
                                className="inputField"
                            />
                        </div>

                        <div className="buttonGroup">
                            <button type="submit" className="continueButton" onClick={handleSubmit}>
                                CONTINUAR
                            </button>
                            <button type="button" className="continueButton" onClick={handleVoltar}>
                                VOLTAR
                            </button>
                        </div>
                    </form>

                    <div className="socialLogin">
                        <p>Faça login com</p>
                        <FaGoogle className="googleIcon" />
                    </div>
                </div>
            </div>
        </div>
    );
}