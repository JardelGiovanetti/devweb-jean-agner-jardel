import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './TelaInicialDevWeb.module.css'; // Importe seu arquivo CSS para estilos específicos do Blog
import Trabalho1 from "../../repositorioImagens/Vendas.png";
import Trabalho2 from "../../repositorioImagens/Seguranca.png";
import Trabalho3 from "../../repositorioImagens/DevWeb.png";


import { useTheme } from '../../ThemeContext';




function TelaicialDevWeb() {

    const { isDarkMode } = useTheme();
    const theme = isDarkMode ? styles.dark : styles.light;

    const [searchTerm, setSearchTerm] = useState('');

    const filteredTopics = [
        { image: Trabalho1, category: 'TRABALHO 1', title: 'Sistema de Vendas Simples Com Java Spring', author: 'Jean Henrique, João Jardel, Gustavo Agner - Acadêmico em Engenharia de Computação - UEPG', path: '/Projetos/WebDev/Trabalho1' },
        { image: Trabalho2, category: 'TRABALHO 2', title: 'Segurança, CSRF, Oauth2, OpendID, Java Web Token, Amazon Cognito', author: 'Jean Henrique, João Jardel, Gustavo Agner - Acadêmico em Engenharia de Computação - UEPG', path: '/Projetos/WebDev/Trabalho1', path: '/Blogs/SoftwareXHardware' },
        { image: Trabalho3, category: 'TRABALHO 3', title: 'Aplicação Completa', author: 'Jean Henrique, João Jardel, Gustavo Agner - Acadêmico em Engenharia de Computação - UEPG', path: '/Projetos/WebDev/Trabalho1', path: '/Blogs/IA' }

    ].filter(topic => topic.title.toLowerCase().includes(searchTerm.toLowerCase()));


    return (

        <div className={theme}>


            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>Desenvolvimento Web UEPG</h1>
                    <p>Interface contendo os três trabalhos realizados na disciplina.</p>



                </header>

                <ul className={styles.topicsList}>
                    {/* Mapeamento dos tópicos filtrados */}
                    {filteredTopics.map(topic => (
                        <li key={topic.title}>
                            <Link to={topic.path}>
                                <img src={topic.image} alt={`Imagem de ${topic.title}`} className={styles.imagem} />
                                <h2>{topic.category}</h2>
                                <h1>{topic.title}</h1>
                                <h3>{topic.author}</h3>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default TelaicialDevWeb;
