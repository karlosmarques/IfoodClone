import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import {
  API_URL,
  STATUS_PEDIDO,
  authHeaders,
  formatarPreco,
  statusInfo,
} from "../componentes/painel";

export default function TelaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/pedidos/historico/restaurante`, { headers: authHeaders() })
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
  // Pedidos cancelados ou ainda sem pagamento não contam como venda
  const vendas = pedidos.filter(
    (p) => p.status !== "CANCELADO" && p.status !== "AGUARDANDO_PAGAMENTO"
  );

  const totalPedidos = vendas.length;

  const faturamentoTotal = vendas.reduce(
    (total, pedido) => total + (pedido.valorTotal || 0),
    0
  );

  const totalItensVendidos = vendas.reduce((total, pedido) => {
    return (
      total +
      (pedido.itens?.reduce((soma, item) => soma + item.quantidade, 0) || 0)
    );
  }, 0);

  const ticketMedio = totalPedidos > 0 ? faturamentoTotal / totalPedidos : 0;

  const maisVendidos = useMemo(() => {
    const mapa = {};
    vendas.forEach((p) =>
      p.itens?.forEach((item) => {
        const nome = item.produto?.nome || "Produto";
        mapa[nome] = mapa[nome] || { nome, qtd: 0, valor: 0 };
        mapa[nome].qtd += item.quantidade;
        mapa[nome].valor += item.subtotal || 0;
      })
    );
    return Object.values(mapa).sort((a, b) => b.qtd - a.qtd).slice(0, 6);
  }, [vendas]);

  const porStatus = Object.keys(STATUS_PEDIDO)
    .map((s) => ({ status: s, qtd: pedidos.filter((p) => p.status === s).length }))
    .filter((s) => s.qtd > 0);

  const kpis = [
    { label: "Pedidos", valor: totalPedidos, icon: "bi-bag-check", tone: "red" },
    { label: "Faturamento", valor: formatarPreco(faturamentoTotal), icon: "bi-cash-stack", tone: "green" },
    { label: "Itens vendidos", valor: totalItensVendidos, icon: "bi-box-seam", tone: "blue" },
    { label: "Ticket médio", valor: formatarPreco(ticketMedio), icon: "bi-receipt-cutoff", tone: "amber" },
  ];

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="pn-loading">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  const maxQtd = maisVendidos[0]?.qtd || 1;

  return (
    <>
      <div className="pn-header">
        <div>
          <h1>Vendas</h1>
          <p>Resumo do desempenho da sua loja</p>
        </div>
      </div>

      <div className="pn-kpis">
        {kpis.map((k) => (
          <div key={k.label} className="pn-card pn-kpi">
            <div className={`pn-kpi-icon pn-tone-${k.tone}`}>
              <i className={`bi ${k.icon}`} />
            </div>
            <div>
              <div className="pn-kpi-label">{k.label}</div>
              <div className="pn-kpi-value">{k.valor}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pn-two-cols">
        <div className="pn-card pn-card-pad">
          <h6 className="pn-section-title">
            <i className="bi bi-trophy" /> Mais vendidos
          </h6>

          {maisVendidos.length === 0 ? (
            <p className="text-muted mb-0">Nenhuma venda registrada ainda.</p>
          ) : (
            maisVendidos.map((p) => (
              <div key={p.nome} className="pn-bar-row">
                <span className="pn-bar-name" title={p.nome}>{p.nome}</span>
                <div className="pn-bar-track">
                  <div
                    className="pn-bar-fill"
                    style={{ width: `${(p.qtd / maxQtd) * 100}%` }}
                  />
                </div>
                <span className="pn-bar-value">{p.qtd}x</span>
              </div>
            ))
          )}
        </div>

        <div className="pn-card pn-card-pad">
          <h6 className="pn-section-title">
            <i className="bi bi-pie-chart" /> Pedidos por status
          </h6>

          {porStatus.length === 0 ? (
            <p className="text-muted mb-0">Nenhum pedido ainda.</p>
          ) : (
            porStatus.map((s) => {
              const info = statusInfo(s.status);
              return (
                <div
                  key={s.status}
                  className="d-flex justify-content-between align-items-center py-2"
                >
                  <span className={`pn-badge pn-tone-${info.tone}`}>{info.label}</span>
                  <strong>{s.qtd}</strong>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
