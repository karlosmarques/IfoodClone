import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { API_URL, authHeaders, formatarPreco } from "../../componentes/painel";

export default function Cardapio() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("TODAS");

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

  async function carregarProdutos() {
    try {
      const res = await axios.get(`${API_URL}/produtos`, { headers: authHeaders() });
      setProdutos(res.data);
    } catch {
      setErro("Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  const categorias = useMemo(
    () => [...new Set(produtos.map((p) => p.categoria?.nome || "Sem categoria"))],
    [produtos]
  );

  const produtosFiltrados = produtos.filter((p) => {
    const cat = p.categoria?.nome || "Sem categoria";
    const termo = busca.trim().toLowerCase();
    return (
      (categoria === "TODAS" || cat === categoria) &&
      (!termo ||
        p.nome?.toLowerCase().includes(termo) ||
        p.descricao?.toLowerCase().includes(termo))
    );
  });

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
        { headers: authHeaders() }
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
        { headers: authHeaders() }
      );
      setShowExcluir(false);
      carregarProdutos();
    } catch {
      alert("Erro ao excluir produto");
    }
  }

  const ativos = produtos.filter((p) => p.ativo).length;

  return (
    <>
      <div className="pn-header">
        <div>
          <h1>Cardápio</h1>
          <p>
            {produtos.length} produto(s) · {ativos} ativo(s)
          </p>
        </div>
        <Link to="/produtos/novo" className="pn-btn pn-btn-primary">
          <i className="bi bi-plus-lg" /> Novo produto
        </Link>
      </div>

      {erro && (
        <div className="pn-alert error">
          <i className="bi bi-exclamation-circle" /> {erro}
        </div>
      )}

      {loading ? (
        <div className="pn-loading">
          <Spinner animation="border" variant="danger" />
        </div>
      ) : produtos.length === 0 ? (
        <div className="pn-card pn-empty">
          <i className="bi bi-journal-plus" />
          <h5>Nenhum produto cadastrado</h5>
          <p>Comece adicionando o primeiro item do seu cardápio.</p>
          <Link to="/produtos/novo" className="pn-btn pn-btn-primary">
            Cadastrar produto
          </Link>
        </div>
      ) : (
        <>
          <div className="d-flex gap-3 flex-wrap align-items-start mb-1">
            <div className="pn-search mb-3">
              <i className="bi bi-search" />
              <input
                className="pn-input"
                placeholder="Buscar produto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            <div className="pn-chips">
              {["TODAS", ...categorias].map((c) => (
                <button
                  key={c}
                  className={`pn-chip ${categoria === c ? "active" : ""}`}
                  onClick={() => setCategoria(c)}
                >
                  {c === "TODAS" ? "Todas" : c}
                </button>
              ))}
            </div>
          </div>

          {produtosFiltrados.length === 0 ? (
            <div className="pn-card pn-empty">
              <i className="bi bi-search" />
              <h5>Nenhum produto encontrado</h5>
            </div>
          ) : (
            <div className="pn-grid">
              {produtosFiltrados.map((p) => (
                <div
                  key={p.idProduto}
                  className={`pn-card pn-product ${p.ativo ? "" : "inativo"}`}
                >
                  <div className="pn-product-img">
                    {p.urlImagem ? (
                      <img src={`${API_URL}${p.urlImagem}`} alt={p.nome} />
                    ) : (
                      <div className="pn-img-placeholder">
                        <i className="bi bi-image" />
                      </div>
                    )}
                    <span className={`pn-badge pn-tone-${p.ativo ? "green" : "gray"}`}>
                      {p.ativo ? "Ativo" : "Pausado"}
                    </span>
                  </div>

                  <div className="pn-product-body">
                    <div className="pn-product-cat">
                      {p.categoria?.nome || "Sem categoria"}
                    </div>
                    <div className="pn-product-name">{p.nome}</div>
                    <div className="pn-product-desc">{p.descricao}</div>

                    <div className="pn-product-foot">
                      <span className="pn-price">{formatarPreco(p.preco)}</span>
                      <div className="d-flex gap-2">
                        <button
                          className="pn-icon-btn"
                          title="Editar"
                          onClick={() => abrirEditar(p)}
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          className="pn-icon-btn danger"
                          title="Excluir"
                          onClick={() => abrirExcluir(p)}
                        >
                          <i className="bi bi-trash3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* MODAL EDITAR */}
      <Modal
        show={showEditar}
        onHide={() => setShowEditar(false)}
        centered
        className="pn-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <label className="pn-label">Nome</label>
              <Form.Control
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <label className="pn-label">Descrição</label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <label className="pn-label">Preço (R$)</label>
              <Form.Control
                type="number"
                step="0.01"
                value={form.preco}
                onChange={(e) => setForm({ ...form, preco: e.target.value })}
              />
            </Form.Group>

            <label className="pn-label">Disponibilidade</label>
            <div className="pn-segmented">
              <button
                type="button"
                className={form.ativo ? "active" : ""}
                onClick={() => setForm({ ...form, ativo: true })}
              >
                Ativo
              </button>
              <button
                type="button"
                className={!form.ativo ? "active" : ""}
                onClick={() => setForm({ ...form, ativo: false })}
              >
                Pausado
              </button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className="pn-btn pn-btn-ghost" onClick={() => setShowEditar(false)}>
            Cancelar
          </button>
          <button className="pn-btn pn-btn-primary" onClick={editarProduto}>
            Salvar
          </button>
        </Modal.Footer>
      </Modal>

      {/* MODAL EXCLUIR */}
      <Modal
        show={showExcluir}
        onHide={() => setShowExcluir(false)}
        centered
        className="pn-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Excluir produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir
          <strong> {produtoSelecionado?.nome}</strong>? Essa ação não pode ser desfeita.
        </Modal.Body>
        <Modal.Footer>
          <button className="pn-btn pn-btn-ghost" onClick={() => setShowExcluir(false)}>
            Cancelar
          </button>
          <button className="pn-btn pn-btn-primary" onClick={excluirProduto}>
            Excluir
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
