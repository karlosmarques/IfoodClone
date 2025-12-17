import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";

export default function TelaPrincipal() {
  const [pedidos, setPedidos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [novoStatus, setNovoStatus] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8081/pedidos/historico/restaurante", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const dados = Array.isArray(response.data)
          ? response.data
          : response.data.content || [];

        setPedidos(dados);
      })
      .catch((error) => {
        console.error("Erro ao carregar pedidos:", error);
      });
  }, []);

  const abrirDetalhes = (pedido) => {
    setPedidoSelecionado(pedido);
    setNovoStatus(pedido.status);
    setShowModal(true);
  };

  const fecharDetalhes = () => {
    setShowModal(false);
    setPedidoSelecionado(null);
    setNovoStatus("");
  };

  const atualizarStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8081/pedidos/${pedidoSelecionado.id}/status`,
        { status: novoStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoSelecionado.id
            ? { ...p, status: novoStatus }
            : p
        )
      );

      setPedidoSelecionado((prev) => ({
        ...prev,
        status: novoStatus,
      }));

      fecharDetalhes();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do pedido");
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "REALIZADO":
        return "secondary";
      case "EM_PREPARO":
        return "warning";
      case "SAIU_PARA_ENTREGA":
        return "info";
      case "ENTREGUE":
        return "success";
      case "CANCELADO":
        return "danger";
      default:
        return "dark";
    }
  };

  return (
    <Container fluid>
      <h2 className="mb-4 fw-bold">Histórico de Pedidos</h2>

      <Row>
        {pedidos.length === 0 && <p>Nenhum pedido encontrado.</p>}

        {pedidos.map((pedido) => (
          <Col md={6} lg={4} className="mb-4" key={pedido.id}>
            <Card className="shadow-sm border-0 rounded-4 h-100">
              <Card.Body>
                <Card.Title>Pedido #{pedido.id}</Card.Title>

                <Card.Text>
                  <strong>Produtos:</strong>
                  <ul className="ps-3 mb-2">
                    {pedido.itens?.map((item, index) => (
                      <li key={index}>
                        {item.produto?.nome} (x{item.quantidade})
                      </li>
                    ))}
                  </ul>

                  <strong>Total:</strong>{" "}
                  R$ {pedido.valorTotal?.toFixed(2)}
                  <br />

                  <strong>Status:</strong>{" "}
                  <span
                    className={`fw-bold text-${statusColor(
                      pedido.status
                    )}`}
                  >
                    {pedido.status}
                  </span>
                </Card.Text>

                <Button
                  variant="danger"
                  className="w-100 rounded-pill"
                  onClick={() => abrirDetalhes(pedido)}
                >
                  Ver detalhes
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* MODAL */}
      <Modal show={showModal} onHide={fecharDetalhes} size="lg" centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            Pedido #{pedidoSelecionado?.id}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-light">
          <div className="mb-4">
            <label className="fw-bold mb-2">Status do pedido</label>
            <select
              className="form-select"
              value={novoStatus}
              onChange={(e) => setNovoStatus(e.target.value)}
            >
              <option value="REALIZADO">Realizado</option>
              <option value="EM_PREPARO">Em preparo</option>
              <option value="SAIU_PARA_ENTREGA">Saiu para entrega</option>
              <option value="ENTREGUE">Entregue</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          {pedidoSelecionado?.itens?.map((item, index) => (
            <Card
              key={index}
              className="mb-3 border-0 shadow-sm rounded-4"
            >
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <h5 className="fw-bold">
                      {item.produto?.nome}
                    </h5>
                    <p className="text-muted">
                      {item.produto?.descricao}
                    </p>
                  </Col>

                  <Col md={4} className="text-end">
                    <p>
                      <strong>Qtd:</strong> {item.quantidade}
                    </p>
                    <p className="fw-bold text-danger">
                      Subtotal:
                      <br />
                      R$ {item.subtotal?.toFixed(2)}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          <hr />

          <h4 className="fw-bold text-end">
            Total:{" "}
            <span className="text-danger">
              R$ {pedidoSelecionado?.valorTotal?.toFixed(2)}
            </span>
          </h4>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={fecharDetalhes}>
            Fechar
          </Button>
          <Button variant="danger" onClick={atualizarStatus}>
            Atualizar status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
