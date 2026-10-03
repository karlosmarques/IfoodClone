import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/painel.css";
import { API_URL, authHeaders } from "../componentes/painel";

const MENU = [
  { to: "/telaprincipal", icon: "bi-receipt", label: "Pedidos" },
  { to: "/vendas", icon: "bi-graph-up-arrow", label: "Vendas" },
  { to: "/produtos/cardapio", icon: "bi-journal-text", label: "Cardápio" },
  { to: "/produtos/novo", icon: "bi-plus-square", label: "Cadastrar produto" },
  { to: "/perfil", icon: "bi-shop", label: "Perfil da loja" },
];

export default function LayoutRestaurante() {
  const [restaurante, setRestaurante] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/restaurante`, { headers: authHeaders() })
      .then((res) => setRestaurante(res.data?.[0] || null))
      .catch(() => setRestaurante(null));
  }, []);

  const logout = () => {
    if (!window.confirm("Deseja sair da sua conta?")) return;
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="pn-app">
      {/* MENU LATERAL */}
      <aside className="pn-sidebar">
        <div className="pn-brand">
          iFood <small>Parceiros</small>
        </div>

        <div className="pn-store">
          {restaurante?.urlImagem ? (
            <img src={`${API_URL}${restaurante.urlImagem}`} alt="" />
          ) : (
            <div className="pn-store-placeholder">
              <i className="bi bi-shop" />
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <div className="pn-store-name">
              {restaurante?.nome || "Minha loja"}
            </div>
            <div className="pn-store-status">Loja aberta</div>
          </div>
        </div>

        <div className="pn-nav-label">Menu</div>
        <nav className="pn-nav">
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `pn-link ${isActive ? "active" : ""}`}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="pn-sidebar-footer">
          <button className="pn-link pn-logout" onClick={logout}>
            <i className="bi bi-box-arrow-right" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* CONTEÚDO DAS TELAS */}
      <main className="pn-main">
        <div className="pn-page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
