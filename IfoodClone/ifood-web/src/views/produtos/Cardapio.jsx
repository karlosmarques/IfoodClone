import axios from "axios";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Modal,
  Form
} from "react-bootstrap";

const API_URL = "http://localhost:8081";

export default function Cardapio() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");

  const [showEditar, setShowEditar] = useState(false);
  const [showExcluir, setShowExcluir] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    ativo: true,
    categoriaId: ""
  });

  const token = localStorage.getItem("token");

  async function carregarProdutos() {
    try {
      const res = await axios.get(`${API_URL}/produtos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProdutos(res.data);
    } catch {
      setErro("Erro ao carregar produtos.");
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  function abrirEditar(p) {
    setProdutoSelecionado(p);
    setForm({
      nome: p.nome,
      descricao: p.descricao,
      preco: p.preco,
      ativo: p.ativo,
      categoriaId: p.categoria?.idCategoria || ""
    });
    setShowEditar(true);
  }

  function abrirExcluir(p) {
    setProdutoSelecionado(p);
    setShowExcluir(true);
  }

  async function editarProduto() {
    try {
      await axios.put(
  `${API_URL}/produtos/editar/${produtoSelecionado.idProduto}`,
  {
    nome: form.nome,
    descricao: form.descricao,
    preco: form.preco,
    ativo: form.ativo,
    categoria: produtoSelecionado.categoria?.nome || ""
  },
  { headers: { Authorization: `Bearer ${token}` } }
);
      setShowEditar(false);
      carregarProdutos();
    } catch {
      alert("Erro ao editar produto");
    }
  }

  async function excluirProduto() {
    try {
      await axios.delete(
        `${API_URL}/produtos/deletar/${produtoSelecionado.idProduto}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowExcluir(false);
      carregarProdutos();
    } catch {
      alert("Erro ao excluir produto");
    }
  }

  return (
    <Container className="py-4">
      <h2 className="fw-bold text-danger">Cardápio</h2>
      <p className="text-muted">Produtos cadastrados no sistema</p>
      <hr />

      {erro && <div className="alert alert-danger">{erro}</div>}

      {produtos.length === 0 ? (
        <div className="text-center mt-5 opacity-75">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
            width="120"
            alt="sem produtos"
            className="mb-3"
          />
          <h5>Nenhum produto cadastrado</h5>
        </div>
      ) : (
        <Row className="mt-3">
          {produtos.map((p) => (
            <Col md={6} lg={4} key={p.idProduto} className="mb-4">
              <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                <Card.Img
                  src={
                    p.urlImagem
                      ? `${API_URL}${p.urlImagem}`
                      : "https://via.placeholder.com/400x200?text=Sem+Imagem"
                  }
                  alt={p.nome}
                  style={{
                    height: "160px",
                    objectFit: "cover"
                  }}
                />

                <Card.Body className="d-flex flex-column">
                  <div>
                    <h5 className="fw-bold mb-1">{p.nome}</h5>
                    <p className="small text-muted">{p.descricao}</p>
                  </div>

                  <p className="fw-semibold mb-2">
                    R$ {Number(p.preco).toFixed(2)}
                  </p>

                  <div className="mb-3">
                    <Badge bg="secondary" className="me-2">
                      {p.categoria?.nome || "Sem categoria"}
                    </Badge>
                    <Badge bg={p.ativo ? "success" : "danger"}>
                      {p.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>

                  <div className="mt-auto">
                    <Button
                      variant="outline-danger"
                      className="w-100 mb-2 rounded-pill"
                      onClick={() => abrirEditar(p)}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="outline-secondary"
                      className="w-100 rounded-pill"
                      onClick={() => abrirExcluir(p)}
                    >
                      Excluir
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* MODAL EDITAR */}
      <Modal show={showEditar} onHide={() => setShowEditar(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                value={form.nome}
                onChange={(e) =>
                  setForm({ ...form, nome: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                value={form.descricao}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Preço</Form.Label>
              <Form.Control
                type="number"
                value={form.preco}
                onChange={(e) =>
                  setForm({ ...form, preco: e.target.value })
                }
              />
            </Form.Group>

            <Form.Check
              type="switch"
              label="Produto ativo"
              checked={form.ativo}
              onChange={(e) =>
                setForm({ ...form, ativo: e.target.checked })
              }
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditar(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={editarProduto}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL EXCLUIR */}
      <Modal show={showExcluir} onHide={() => setShowExcluir(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Excluir Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir
          <strong> {produtoSelecionado?.nome}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExcluir(false)}>
            Não
          </Button>
          <Button variant="danger" onClick={excluirProduto}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
