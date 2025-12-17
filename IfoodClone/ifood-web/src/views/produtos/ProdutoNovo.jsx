import axios from "axios";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

  const styles = {
  label: {
    marginBottom: 6,
    display: "block",
  },
    input: {
    width: "100%",
    padding: 13,
    marginBottom: 15,
    border: "1px solid #dee2e6",
    borderRadius: 10,
    fontSize: 15,
    transition: "0.3s",
  },

  }



export default function ProdutoNovo() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [imagem, setImagem] = useState(null);
  

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const token = localStorage.getItem("token");

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

    const token = localStorage.getItem("token");

    await axios.post("http://localhost:8081/produtos/criar", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setSucesso("Produto cadastrado com sucesso!");

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
  }
}

  return (
  <Container className="mt-5 mb-5">
    <Row className="justify-content-center">
      <Col lg={8}>
        {/* HEADER */}
        <Card className="border-0 shadow rounded-4 mb-4">
          <Card.Body className="p-4">
            <h2 className="fw-bold text-danger mb-1">
              Cadastrar Novo Produto
            </h2>
            <p className="text-muted mb-0">
              Adicione um novo item ao seu cardápio
            </p>
          </Card.Body>
        </Card>

        {/* FORMULÁRIO */}
        <Card className="border-0 shadow rounded-4">
          <Card.Body className="p-4">
            {erro && (
              <div className="alert alert-danger rounded-3">
                {erro}
              </div>
            )}
            {sucesso && (
              <div className="alert alert-success rounded-3">
                {sucesso}
              </div>
            )}

            <Form onSubmit={cadastrarProduto}>
              {/* IMAGEM */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">
                  Imagem do Produto
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagem(e.target.files[0])}
                  className="rounded-3"
                />
                <Form.Text className="text-muted">
                  Utilize imagens em boa resolução
                </Form.Text>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Nome do Produto
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ex: X-Burger"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="rounded-3"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Categoria
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Lanche, Bebida, Sobremesa..."
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="rounded-3"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Descrição
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Descreva o produto"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="rounded-3"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Preço
                    </Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      className="rounded-3"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Status
                    </Form.Label>
                    <Form.Select
                      value={ativo}
                      onChange={(e) =>
                        setAtivo(e.target.value === "true")
                      }
                      className="rounded-3"
                    >
                      <option value="true">Ativo</option>
                      <option value="false">Desativado</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Button
                variant="danger"
                type="submit"
                className="w-100 rounded-pill py-2 fw-bold mt-3"
              >
                Salvar Produto
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);
}
