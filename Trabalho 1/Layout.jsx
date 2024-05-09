import React from 'react';
import styles from './Layout.module.css'; // Importe o arquivo CSS
import { useTheme } from '../../../ThemeContext';



const Layout = ({ children }) => {

    const { isDarkMode } = useTheme();
    const theme = isDarkMode ? styles.dark : styles.light


    return (
        <div className={theme}>
            <div className={styles.container}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
