// src/components/CadastroProfessor.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

// Assets
import logo from '../assets/logo.png';
import mundo from '../assets/mundo.png';
import mundoBaixo from '../assets/mundoBaixo.svg';

// Styles
import './CadastroProfessor.css';

export default function CadastroProfessor() {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [instituicao, setInstituicao] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleCpfChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 9) {
            value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/^(\d{3})(\d{3})$/, '$1.$2');
        }
        
        setCpf(value);
    };

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
            <img src={logo} alt="Logo da plataforma" className="logoProfessor" />
            <img src={mundo} alt="Elemento decorativo superior" className="mundoProfessor" />
            <img src={mundoBaixo} alt="Elemento decorativo inferior" className="mundoBaixo" />

            <div className="loginBox">
                <div className="welcomeContainer">
                    <h1 className="welcomeTitle">Seja Bem Vindo!</h1>
                    <p className="welcomeSubtitle">Crie sua conta, leva menos de um minuto!</p>

                    <form className="formContainer">
                        <div className="inputGroup">
                            <label htmlFor="nome">Professor</label>
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
                            <label htmlFor="cpf">CPF</label>
                            <input
                                type="text"
                                id="cpf"
                                value={cpf}
                                onChange={handleCpfChange}
                                placeholder="___.___.___-__"
                                className="inputField"
                                maxLength={14}
                            />
                        </div>

                        <div className="inputGroup">
                            <label htmlFor="email">E-mail Corporativo</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Digite o e-mail corporativo"
                                className="inputField"
                            />
                        </div>

                        <div className="inputGroup">
                            <label htmlFor="instituicao">Instituição de Ensino</label>
                            <input
                                type="text"
                                id="instituicao"
                                value={instituicao}
                                onChange={(e) => setInstituicao(e.target.value)}
                                placeholder="Digite o nome da instituição"
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