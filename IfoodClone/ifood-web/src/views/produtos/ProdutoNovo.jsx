import axios from "axios";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { API_URL, authHeaders, formatarPreco } from "../../componentes/painel";

export default function ProdutoNovo() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Gera a prévia da imagem escolhida
  useEffect(() => {
    if (!imagem) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(imagem);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imagem]);

  // ------------------------------------------
  // CADASTRAR PRODUTO
  // ------------------------------------------
  async function cadastrarProduto(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    // validações
    if (!nome || !descricao || !preco || !categoria)
      return setErro("Preencha todos os campos!");

    if (!imagem)
      return setErro("Envie uma imagem do produto!");

    try {
      setEnviando(true);

      const dados = {
        nome,
        descricao,
        preco: parseFloat(preco),
        categoria,
        ativo,
      };

      const formData = new FormData();
      formData.append("dados", new Blob([JSON.stringify(dados)], { type: "application/json" }));
      formData.append("imagem", imagem);

      await axios.post(`${API_URL}/produtos/criar`, formData, {
        headers: {
          ...authHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      setSucesso(`"${nome}" foi adicionado ao cardápio!`);

      // limpa os campos
      setNome("");
      setDescricao("");
      setPreco("");
      setCategoria("");
      setAtivo(true);
      setImagem(null);
    } catch (e) {
      console.error(e);
      setErro(e.response?.data?.message || "Erro ao cadastrar produto.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <div className="pn-header">
        <div>
          <h1>Cadastrar produto</h1>
          <p>Adicione um novo item ao seu cardápio</p>
        </div>
        <Link to="/produtos/cardapio" className="pn-btn pn-btn-ghost">
          <i className="bi bi-journal-text" /> Ver cardápio
        </Link>
      </div>

      <div className="pn-form-layout">
        {/* FORMULÁRIO */}
        <div className="pn-card pn-card-pad">
          {erro && (
            <div className="pn-alert error">
              <i className="bi bi-exclamation-circle" /> {erro}
            </div>
          )}
          {sucesso && (
            <div className="pn-alert success">
              <i className="bi bi-check-circle" /> {sucesso}
            </div>
          )}

          <Form onSubmit={cadastrarProduto}>
            {/* IMAGEM */}
            <label className="pn-label">Foto do produto</label>
            <label className="pn-dropzone mb-4">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImagem(e.target.files[0] || null)}
              />
              <i className="bi bi-cloud-arrow-up" />
              {imagem ? (
                <>
                  <strong>{imagem.name}</strong>
                  <div className="small">Clique para trocar</div>
                </>
              ) : (
                <>
                  <strong>Clique para enviar uma imagem</strong>
                  <div className="small">JPG, PNG ou WEBP em boa resolução</div>
                </>
              )}
            </label>

            <div className="row">
              <div className="col-md-7 mb-3">
                <label className="pn-label">Nome do produto</label>
                <Form.Control
                  type="text"
                  placeholder="Ex: X-Burger"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="col-md-5 mb-3">
                <label className="pn-label">Categoria</label>
                <Form.Control
                  type="text"
                  placeholder="Lanches, Bebidas..."
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="pn-label">Descrição</label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ingredientes, tamanho, acompanhamentos..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="pn-label">Preço (R$)</label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="pn-label">Disponibilidade</label>
                <div className="pn-segmented">
                  <button
                    type="button"
                    className={ativo ? "active" : ""}
                    onClick={() => setAtivo(true)}
                  >
                    Ativo
                  </button>
                  <button
                    type="button"
                    className={!ativo ? "active" : ""}
                    onClick={() => setAtivo(false)}
                  >
                    Pausado
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="pn-btn pn-btn-primary w-100 mt-2 py-3"
              disabled={enviando}
            >
              {enviando ? "Salvando..." : "Salvar produto"}
            </button>
          </Form>
        </div>

        {/* PRÉVIA */}
        <div className="pn-sticky">
          <div className="pn-label mb-2">Prévia no cardápio</div>
          <div className={`pn-card pn-product ${ativo ? "" : "inativo"}`}>
            <div className="pn-product-img">
              {preview ? (
                <img src={preview} alt="Prévia" />
              ) : (
                <div className="pn-img-placeholder">
                  <i className="bi bi-image" />
                </div>
              )}
              <span className={`pn-badge pn-tone-${ativo ? "green" : "gray"}`}>
                {ativo ? "Ativo" : "Pausado"}
              </span>
            </div>
            <div className="pn-product-body">
              <div className="pn-product-cat">{categoria || "Categoria"}</div>
              <div className="pn-product-name">{nome || "Nome do produto"}</div>
              <div className="pn-product-desc">
                {descricao || "A descrição do produto aparece aqui."}
              </div>
              <div className="pn-product-foot">
                <span className="pn-price">{formatarPreco(preco)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
