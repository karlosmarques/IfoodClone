import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";

export default function PerfilRestaurante() {
  const [restaurante, setRestaurante] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const[id, setId] = useState("");

  const token = localStorage.getItem("token");
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
      await axios.delete(`http://localhost:8081/restaurante/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      await axios.put(
        "http://localhost:8081/restaurante/editar",
        restaurante,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Restaurante atualizado com sucesso!");
      setEditando(false);
    } catch {
      alert("Erro ao salvar restaurante.");
    }
  };

  /* ================= SALVAR PERFIL ================= */
  const salvarEdicaoPerfil = async () => {
    try {
      await axios.put(
        "http://localhost:8081/perfil/editar",
        usuario,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Perfil atualizado com sucesso!");
      setEditando(false);
    } catch {
      alert("Erro ao salvar perfil.");
    }
  };

  /* ================= CARREGAR DADOS ================= */
  const carregarDados = async () => {

    try {

      const response = await axios.get("http://localhost:8081/restaurante", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const id =response.data[0].idRestaurante
      setId(id);

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
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="danger" />
      </div>
    );

  if (erro) return <p className="text-center text-danger">{erro}</p>;
  if (!restaurante || !usuario)
    return <p className="text-center">Nenhum dado encontrado.</p>;

  const imagemUrl = `http://localhost:8081${restaurante.urlImagem}`;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg p-4 rounded-4 border-0">
            <h2 className="text-center fw-bold text-danger mb-4">
              Perfil do Restaurante
            </h2>

            {/* IMAGEM */}
            <div className="text-center mb-4">
              <img
                src={imagemUrl}
                alt="Restaurante"
                style={{
                  width: 180,
                  height: 180,
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "4px solid #dc3545",
                }}
              />
            </div>

            {/* ================= RESTAURANTE ================= */}
            <Card className="p-3 mb-4 border-0 shadow-sm">
              <div className="d-flex justify-content-end mb-2">
                {!editando && (
                  <i
                    className="bi bi-pencil fs-2 text-warning me-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => setEditando(true)}
                  />
                )}
                <i
                  className="bi bi-trash-fill fs-2 text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={excluirPerfil}
                />
              </div>

              <h4 className="text-danger mb-3">
                Informações do Restaurante
              </h4>

              <Campo
                label="Nome"
                valor={restaurante.nome}
                editando={editando}
                onChange={(v) =>
                  setRestaurante({ ...restaurante, nome: v })
                }
              />

              <Campo
                label="CNPJ"
                valor={restaurante.cnpj}
                editando={editando}
                onChange={(v) =>
                  setRestaurante({ ...restaurante, cnpj: v })
                }
              />

              <Campo
                label="Telefone"
                valor={restaurante.telefone}
                editando={editando}
                onChange={(v) =>
                  setRestaurante({ ...restaurante, telefone: v })
                }
              />

              <Campo
                label="Raio de entrega (km)"
                type="number"
                valor={restaurante.raio_entrega}
                editando={editando}
                onChange={(v) =>
                  setRestaurante({ ...restaurante, raio_entrega: v })
                }
              />

              {editando && (
                <Button
                  className="w-100 mt-3"
                  variant="success"
                  onClick={salvarEdicaoRestaurante}
                >
                  Salvar alterações
                </Button>
              )}
            </Card>

            {/* ================= DONO ================= */}
            <Card className="p-3 mb-3 border-0 shadow-sm">

              <div className="d-flex justify-content-end mb-2">
                {!editando && (
                  <i
                    className="bi bi-pencil fs-2 text-warning me-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => setEditando(true)}
                  />
                )}
                <i
                  className="bi bi-trash-fill fs-2 text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={excluirPerfil}
                />
              </div>
              <h4 className="text-danger mb-3">Dono do Restaurante</h4>

              <Campo
                label="Nome"
                valor={usuario.nome}
                editando={editando}
                onChange={(v) =>
                  setUsuario({ ...usuario, nome: v })
                }
              />

              <Campo
                label="Email"
                valor={usuario.email}
                editando={editando}
                onChange={(v) =>
                  setUsuario({ ...usuario, email: v })
                }
              />

              <Campo
                label="CPF"
                valor={usuario.cpf}
                editando={editando}
                onChange={(v) =>
                  setUsuario({ ...usuario, cpf: v })
                }
              />

              <Campo
                label="Telefone"
                valor={usuario.foneCelular}
                editando={editando}
                onChange={(v) =>
                  setUsuario({ ...usuario, foneCelular: v })
                }
              />

              {editando && (
                <Button
                  className="w-100 mt-3"
                  variant="success"
                  onClick={salvarEdicaoPerfil}
                >
                  Salvar alterações
                </Button>
              )}
            </Card>

            {/* LOGOUT */}
            <div
              className="d-flex justify-content-end align-items-center text-danger"
              style={{ cursor: "pointer" }}
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right fs-4 me-2"></i>
              <span className="fw-semibold">Sair</span>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

/* ================= COMPONENTE CAMPO ================= */
function Campo({ label, valor, editando = false, onChange, type = "text" }) {
  return (
    <div className="mb-2">
      <strong>{label}</strong>
      {!editando ? (
        <div>{valor}</div>
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
