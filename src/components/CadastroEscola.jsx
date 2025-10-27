// src/components/CadastroEscola.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

// Assets
import logo from '../assets/logo.png';
import mundo from '../assets/mundo.png';
import mundoBaixo from '../assets/mundoBaixo.svg';

// Styles
import './CadastroEscola.css';

export default function CadastroEscola() {
    const [cnpj, setCnpj] = useState('');
    const [email, setEmail] = useState('');
    const [instituicao, setInstituicao] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleCnpjChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 12) {
            value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
        } else if (value.length > 8) {
            value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})$/, '$1.$2.$3/$4');
        } else if (value.length > 5) {
            value = value.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2.$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{3})$/, '$1.$2');
        }

        setCnpj(value);
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
            <img src={logo} alt="Logo da plataforma" className="logoEscola" />
            <img src={mundo} alt="Elemento decorativo superior" className="mundoEscola" />
            <img src={mundoBaixo} alt="Elemento decorativo inferior" className="mundoBaixo" />

            <div className="loginBox">
                <div className="welcomeContainer">
                    <h1 className="welcomeTitle">Seja Bem Vindo!</h1>
                    <p className="welcomeSubtitle">Crie sua conta, leva menos de um minuto!</p>

                    <form className="formContainer">
                        <div className="inputGroup">
                            <label htmlFor="cnpj">CNPJ</label>
                            <input
                                type="text"
                                id="cnpj"
                                value={cnpj}
                                onChange={handleCnpjChange}
                                placeholder="__.___.___/____-__"
                                className="inputField"
                                maxLength={18}
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
                            <label htmlFor="instituicao">Nome da Instituição</label>
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
