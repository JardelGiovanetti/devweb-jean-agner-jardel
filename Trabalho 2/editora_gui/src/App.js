import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import { Routes, BrowserRouter, Route, Link } from "react-router-dom";

import ListArtigo from "./components/listArtigo";
import AddArtigo from "./components/addArtigo";
import Artigo from "./components/artigo";


class App extends Component {
  render() {
      return (
              <div>

                  <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
                    <div className="container">

                        <b><i>Editora</i></b>

                      <div className="navbar-nav mr-auto">
                        <li className="nav_item">

                            Listar

                        </li>
                        <li className="nav_item">

                            Adicionar

                        </li>
                      </div>
                    </div>
                  </nav>
                  <div className="container mt-3">

                  </div>

              </div>
             );
  }
}
export default App;
