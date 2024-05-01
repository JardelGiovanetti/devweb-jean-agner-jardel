import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NotFound from './Tela Principal/NotFound.jsx';

import axios from 'axios';
import axiosRateLimit from 'axios-rate-limit';
import Trabalho1 from './Tela Principal/Trabalho1.jsx';

// Configura o axios para limitar as solicitações a 10 por minuto
const http = axiosRateLimit(axios.create(), { maxRequests: 10, perMilliseconds: 60000 });

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route exact path="/" element={<Trabalho1 />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
