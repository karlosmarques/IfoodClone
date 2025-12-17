import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LayoutRestaurante from "./layouts/LayoutRestaurante";
import PrivateRoute from "./rotas/PrivateRoute";

import FormLogin from "./views/login/FormLogin";
import FormCadastroRest from "./views/cadastros/FormCadastroRest";
import FormCadastroDonoRest from "./views/cadastros/FormCadastroDonoRest";
import EsqueceuSenha from "./views/login/EsqueceuSenha";
import TrocarSenha from "./views/login/TrocarSenha";

import TelaPrincipal from "./views/TelaPrincipal";
import Perfil from "./views/perfil/Perfil";
import ProdutoNovo from "./views/produtos/ProdutoNovo";
import Cardapio from "./views/produtos/Cardapio";
import Vendas from "./views/Vendas";

function App() {
  return (
    <Router>
      <Routes>

        {/* ROTAS PÚBLICAS (sem login) */}
        <Route path="/" element={<FormLogin />} />
        <Route path="/cadastroRest" element={<FormCadastroRest />} />
        <Route path="/cadastroDonoRest" element={<FormCadastroDonoRest />} />
        <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />

        {/* ROTAS PROTEGIDAS */}
        <Route element={<PrivateRoute />}>
          <Route element={<LayoutRestaurante />}>
            <Route path="/telaprincipal" element={<TelaPrincipal />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/produtos/novo" element={<ProdutoNovo />} />
            <Route path="/produtos/cardapio" element={<Cardapio />} />
            <Route path="/vendas" element={<Vendas />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
