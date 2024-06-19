import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { useTheme } from '../../ThemeContext';

function AuthPage() {
    const { isDarkMode } = useTheme();
    const theme = isDarkMode ? styles.dark : styles.light;

    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        return password.length > 6 && password.length <= 30;
    };

    const validateUsername = (username) => {
        const re = /^[a-zA-Z0-9 _-]{3,30}$/; // Permitir espaços no nome de usuário
        return re.test(username);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            alert("Por favor, insira um email válido.");
            return;
        }

        if (!validatePassword(password)) {
            alert("A senha deve ter entre 7 e 30 caracteres.");
            return;
        }

        if (!isLogin && !validateUsername(username)) {
            alert("O nome de usuário deve ter entre 3 e 30 caracteres e pode conter espaços.");
            return;
        }

        try {
            if (isLogin) {
                const response = await axios.post('https://app.jeanhenrique.site/Projetos/To-Do-List/login', { email, password });
                localStorage.setItem('token', response.data.token);
                navigate('/Projetos/To-Do-List');
            } else {
                await axios.post('https://app.jeanhenrique.site/Projetos/To-Do-List/register', { username, password, email });
                alert('Registro bem-sucedido. Por favor, faça login.');
                setIsLogin(true);
            }
        } catch (error) {
            console.error(`Erro ao ${isLogin ? 'fazer login' : 'registrar'}:`, error);
            alert(`Erro ao ${isLogin ? 'fazer login' : 'registrar'}. Verifique suas credenciais.`);
        }
    };

    return (
        <div className={`${styles.container} ${theme}`}>
            <div className={styles.formContainer}>
                <div className={styles.form}>
                    <h1>Lista de Afazeres</h1>
                    <h2>{isLogin ? 'Login' : 'Cadastro de Usuário'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.column}>
                            {!isLogin && (
                                <input
                                    type="text"
                                    placeholder="Usuário"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            )}
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="submit">{isLogin ? 'Entrar' : 'Cadastrar'}</button>
                        </div>
                    </form>
                    <p>{isLogin ? 'Ainda não possui uma conta?' : ''}
                        <button className={styles.toggleButton} onClick={toggleForm}>
                            {isLogin ? 'Cadastre seu usuário' : 'Já possuo uma conta'}
                        </button>
                    </p>
                </div>
                <div className={styles.ContainerLado}>
                    <h2>Seja bem-vindo(a)</h2>
                    <h2>Leia os seguintes avisos antes de criar sua conta: </h2>
                    <ul>
                        <li>Caso não tenha feito sua conta, clique em "Cadastre seu usuário" na parte abaixo do botão "entrar"</li>
                        <li>Caso você não realize um novo login na sua conta após 7 dias, ela será excluída!</li>
                        <li>Haverá a limitação de apenas 1 conta por IP por 7 dias, então, tome cuidado ao inserir os dados.</li>
                        <li>Seu nome de usuário e senha serão enviados para o seu e-mail. Por conta disto, não haverá opção "Esqueci minha Senha", caso esqueça sua senha, consulte o seu e-mail ou faça outra conta.</li>
                        <li>Caso você fique mais do que 7 dias sem acessar sua conta, você poderá criar uma nova conta no mesmo ip, pois seu ip será excluído do registro após 7 dias.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
