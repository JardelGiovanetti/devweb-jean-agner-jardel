import React, { Component } from "react";
import ArtigoDataService from "../services/artigoDataService";
import { Link } from "react-router-dom";


export default class ListArtigo extends Component {
  
    render() {
        
    
        return (
          <div className="list row">
            <div className="col-md-8">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por título"

                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"

                  >
                    Buscar
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <h4>Artigos</h4>
    
              <ul className="list-group">

                    <li
                      
                      >

                    </li>

              </ul>
    
              <button
                className="m-1 btn btn-sm btn-danger"
                >Excluir todos
              </button>
            </div>
            <div className="col-md-6">

                <div>
                  <h4>&nbsp;</h4>
                  <div>
                    <label>
                      <strong>Título:</strong>
                    </label>
                  </div>
                  <div>
                    <label>
                      <strong>Resumo:</strong>
                    </label>

                  </div>
                  <div>
                    <label>
                      <strong>Status:</strong>
                    </label>

                  </div>
    
                  
                </div>
              
                <div>
                  <h4>&nbsp;</h4>
                  
                  <p><i>Para detalhes, selecionar um artigo.</i></p>
                </div>
              
            </div>
          </div>
        );
      }
}