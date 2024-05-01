// Layout.js
import React from 'react';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles({
    root: {
        backgroundImage: 'url(' + require('./RepositorioImagens/Fundo.png') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'multiply',
        backgroundColor: 'rgb(121, 121, 121)'
    },
});

const Layout = ({ children }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {children}
        </div>
    );
};

export default Layout;
