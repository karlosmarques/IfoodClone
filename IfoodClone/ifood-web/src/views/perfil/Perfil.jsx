import axios from "axios";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { API_URL, authHeaders } from "../../componentes/painel";

export default function PerfilRestaurante() {
  const [restaurante, setRestaurante] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [editandoLoja, setEditandoLoja] = useState(false);
  const [editandoDono, setEditandoDono] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [id, setId] = useState("");

  /* ================= LOGOUT ================= */
  const logout = () => {
    if (!window.confirm("Deseja sair da sua conta?")) return;
    localStorage.clear();
    window.location.href = "/";
  };

  /* ================= EXCLUIR ================= */
  const excluirPerfil = async () => {
    if (!window.confirm("Tem certeza que deseja excluir o restaurante?")) return;

    try {
      await axios.delete(`${API_URL}/restaurante/${id}`, { headers: authHeaders() });

      alert("Perfil excluído com sucesso!");
      localStorage.clear();
      window.location.href = "/";
    } catch {
      alert("Erro ao excluir perfil.");
    }
  };

  /* ================= SALVAR RESTAURANTE ================= */
  const salvarEdicaoRestaurante = async () => {
    try {
      await axios.put(`${API_URL}/restaurante/editar`, restaurante, {
        headers: authHeaders(),
      });

      alert("Restaurante atualizado com sucesso!");
      setEditandoLoja(false);
    } catch {
      alert("Erro ao salvar restaurante.");
    }
  };

  /* ================= SALVAR PERFIL ================= */
  const salvarEdicaoPerfil = async () => {
    try {
      await axios.put(`${API_URL}/perfil/editar`, usuario, {
        headers: authHeaders(),
      });

      alert("Perfil atualizado com sucesso!");
      setEditandoDono(false);
    } catch {
      alert("Erro ao salvar perfil.");
    }
  };

  /* ================= CARREGAR DADOS ================= */
  const carregarDados = async () => {
    try {
      const response = await axios.get(`${API_URL}/restaurante`, {
        headers: authHeaders(),
      });

      setId(response.data[0].idRestaurante);
      setRestaurante(response.data[0]);
      setUsuario(response.data[0].usuario);
    } catch {
      setErro("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  if (loading)
    return (
      <div className="pn-loading">
        <Spinner animation="border" variant="danger" />
      </div>
    );

  if (erro)
    return (
      <div className="pn-alert error">
        <i className="bi bi-exclamation-circle" /> {erro}
      </div>
    );

  if (!restaurante || !usuario)
    return (
      <div className="pn-card pn-empty">
        <i className="bi bi-shop" />
        <h5>Nenhum dado encontrado</h5>
      </div>
    );

  const end = restaurante.endereco;

  return (
    <>
      {/* CAPA */}
      <div className="pn-card mb-4">
        <div className="pn-cover" />
        <div className="pn-profile-head">
          <img src={`${API_URL}${restaurante.urlImagem}`} alt="Restaurante" />
          <div className="pb-1">
            <h2>{restaurante.nome}</h2>
            <div className="d-flex gap-2 flex-wrap mt-1">
              {restaurante.categoria?.nome && (
                <span className="pn-badge plain pn-tone-red">
                  {restaurante.categoria.nome}
                </span>
              )}
              {restaurante.raio_entrega && (
                <span className="pn-badge plain pn-tone-gray">
                  <i className="bi bi-geo-alt" /> Entrega até {restaurante.raio_entrega} km
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= RESTAURANTE ================= */}
      <Secao
        titulo="Informações da loja"
        icone="bi-shop"
        editando={editandoLoja}
        onEditar={() => setEditandoLoja(true)}
        onCancelar={() => {
          setEditandoLoja(false);
          carregarDados();
        }}
        onSalvar={salvarEdicaoRestaurante}
      >
        <Campo
          label="Nome"
          valor={restaurante.nome}
          editando={editandoLoja}
          onChange={(v) => setRestaurante({ ...restaurante, nome: v })}
        />
        <Campo
          label="CNPJ"
          valor={restaurante.cnpj}
          editando={editandoLoja}
          onChange={(v) => setRestaurante({ ...restaurante, cnpj: v })}
        />
        <Campo
          label="Telefone"
          valor={restaurante.telefone}
          editando={editandoLoja}
          onChange={(v) => setRestaurante({ ...restaurante, telefone: v })}
        />
        <Campo
          label="Raio de entrega (km)"
          type="number"
          valor={restaurante.raio_entrega}
          editando={editandoLoja}
          onChange={(v) => setRestaurante({ ...restaurante, raio_entrega: v })}
        />
        {end && (
          <Campo
            label="Endereço"
            valor={`${end.rua}, ${end.numero} - ${end.bairro}, ${end.cidade}/${end.estado}`}
          />
        )}
      </Secao>

      {/* ================= DONO ================= */}
      <Secao
        titulo="Responsável"
        icone="bi-person"
        editando={editandoDono}
        onEditar={() => setEditandoDono(true)}
        onCancelar={() => {
          setEditandoDono(false);
          carregarDados();
        }}
        onSalvar={salvarEdicaoPerfil}
      >
        <Campo
          label="Nome"
          valor={usuario.nome}
          editando={editandoDono}
          onChange={(v) => setUsuario({ ...usuario, nome: v })}
        />
        <Campo
          label="E-mail"
          valor={usuario.email}
          editando={editandoDono}
          onChange={(v) => setUsuario({ ...usuario, email: v })}
        />
        <Campo
          label="CPF"
          valor={usuario.cpf}
          editando={editandoDono}
          onChange={(v) => setUsuario({ ...usuario, cpf: v })}
        />
        <Campo
          label="Telefone"
          valor={usuario.foneCelular}
          editando={editandoDono}
          onChange={(v) => setUsuario({ ...usuario, foneCelular: v })}
        />
      </Secao>

      {/* ================= CONTA ================= */}
      <div className="pn-card pn-card-pad pn-danger-zone d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h6 className="pn-section-title mb-1">Conta</h6>
          <p className="text-muted small mb-0">
            Excluir a loja remove o cardápio e o histórico permanentemente.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="pn-btn pn-btn-ghost" onClick={logout}>
            <i className="bi bi-box-arrow-right" /> Sair
          </button>
          <button className="pn-btn pn-btn-danger-ghost" onClick={excluirPerfil}>
            <i className="bi bi-trash3" /> Excluir loja
          </button>
        </div>
      </div>
    </>
  );
}

/* ================= SEÇÃO EDITÁVEL ================= */
function Secao({ titulo, icone, editando, onEditar, onCancelar, onSalvar, children }) {
  return (
    <div className="pn-card pn-card-pad mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="pn-section-title mb-0">
          <i className={`bi ${icone}`} /> {titulo}
        </h6>
        {editando ? (
          <div className="d-flex gap-2">
            <button className="pn-btn pn-btn-ghost" onClick={onCancelar}>
              Cancelar
            </button>
            <button className="pn-btn pn-btn-primary" onClick={onSalvar}>
              Salvar
            </button>
          </div>
        ) : (
          <button className="pn-btn pn-btn-ghost" onClick={onEditar}>
            <i className="bi bi-pencil" /> Editar
          </button>
        )}
      </div>
      <div className="pn-fields">{children}</div>
    </div>
  );
}

/* ================= COMPONENTE CAMPO ================= */
function Campo({ label, valor, editando = false, onChange, type = "text" }) {
  return (
    <div>
      <label className="pn-label">{label}</label>
      {!editando || !onChange ? (
        <div className="pn-field-value">{valor || "—"}</div>
      ) : (
        <input
          className="form-control"
          type={type}
          value={valor || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
