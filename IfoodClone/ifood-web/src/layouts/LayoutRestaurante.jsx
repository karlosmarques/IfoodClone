import { NavLink, Outlet } from "react-router-dom";

export default function LayoutRestaurante() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      
      {/* MENU LATERAL */}
      <aside
        className="text-white p-4 d-flex flex-column"
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #ea1d2c, #b91521)",
        }}
      >
        <h3 className="fw-bold text-center mb-5">iFood 2.0</h3>

        <NavLink
          to="/telaprincipal"
          className={({ isActive }) =>
            `menu-link mb-3 ${isActive ? "menu-active" : ""}`
          }
        >
          Histórico de Pedidos
        </NavLink>


        <NavLink
          to="/produtos/novo"
          className={({ isActive }) =>
            `menu-link mb-3 ${isActive ? "menu-active" : ""}`
          }
        >
          Cadastrar Produtos
        </NavLink>

        <NavLink
          to="/produtos/cardapio"
          className={({ isActive }) =>
            `menu-link mb-3 ${isActive ? "menu-active" : ""}`
          }
        >
          Cardápio
        </NavLink>
<NavLink
          to="/vendas"
          className={({ isActive }) =>
            `menu-link mb-3 ${isActive ? "menu-active" : ""}`
          }
        >
          Vendas
        </NavLink>
        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            `menu-link mb-3 ${isActive ? "menu-active" : ""}`
          }
        >
          Perfil 
        </NavLink>
      </aside>

      {/* CONTEÚDO DAS TELAS */}
      <main className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </main>

      {/* ESTILOS */}
      <style>{`
        .menu-link {
          text-decoration: none;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.15);
          color: white;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .menu-link:hover {
          background: rgba(255,255,255,0.3);
          transform: translateX(5px);
        }

        .menu-active {
          background: white;
          color: #ea1d2c;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
