import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TelaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8081/pedidos/historico/restaurante", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const dados = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setPedidos(dados);
      })
      .catch((error) => {
        console.log("Erro ao carregar pedidos:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  // ===== CÁLCULOS =====
  const totalPedidos = pedidos.length;

  const faturamentoTotal = pedidos.reduce(
    (total, pedido) => total + (pedido.valorTotal || 0),
    0
  );

  const totalItensVendidos = pedidos.reduce((total, pedido) => {
    return (
      total +
      (pedido.itens?.reduce(
        (soma, item) => soma + item.quantidade,
        0
      ) || 0)
    );
  }, 0);

  const ticketMedio =
    totalPedidos > 0 ? faturamentoTotal / totalPedidos : 0;

  // ===== LOADING =====
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  return (
    <Container fluid>
      <h2 className="fw-bold mb-4">Resumo de Vendas</h2>

      <Row className="g-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 text-center">
            <Card.Body>
              <h6 className="text-muted">Pedidos</h6>
              <h2 className="fw-bold text-danger">{totalPedidos}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 text-center">
            <Card.Body>
              <h6 className="text-muted">Faturamento</h6>
              <h2 className="fw-bold text-success">
                R$ {faturamentoTotal.toFixed(2)}
              </h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 text-center">
            <Card.Body>
              <h6 className="text-muted">Itens Vendidos</h6>
              <h2 className="fw-bold">{totalItensVendidos}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 text-center">
            <Card.Body>
              <h6 className="text-muted">Ticket Médio</h6>
              <h2 className="fw-bold">
                R$ {ticketMedio.toFixed(2)}
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
