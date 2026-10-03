import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Modal, Spinner } from "react-bootstrap";
import {
  API_URL,
  PAGAMENTO,
  PAGAMENTO_STATUS,
  STATUS_PEDIDO,
  authHeaders,
  formatarData,
  formatarPreco,
  statusInfo,
} from "../componentes/painel";

// Status que o restaurante pode escolher ao atualizar um pedido
const STATUS_EDITAVEIS = ["REALIZADO", "EM_PREPARO", "SAIU_PARA_ENTREGA", "ENTREGUE", "CANCELADO"];

export default function TelaPrincipal() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("TODOS");
  const [showModal, setShowModal] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [novoStatus, setNovoStatus] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/pedidos/historico/restaurante`, { headers: authHeaders() })
      .then((response) => {
        const dados = Array.isArray(response.data)
          ? response.data
          : response.data.content || [];

        setPedidos([...dados].sort((a, b) => b.id - a.id));
      })
      .catch((error) => {
        console.error("Erro ao carregar pedidos:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const contagem = useMemo(() => {
    const c = {};
    pedidos.forEach((p) => (c[p.status] = (c[p.status] || 0) + 1));
    return c;
  }, [pedidos]);

  const pedidosFiltrados =
    filtro === "TODOS" ? pedidos : pedidos.filter((p) => p.status === filtro);

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
      setSalvando(true);

      await axios.put(
        `${API_URL}/pedidos/${pedidoSelecionado.id}/status`,
        { status: novoStatus },
        { headers: authHeaders() }
      );

      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoSelecionado.id ? { ...p, status: novoStatus } : p
        )
      );

      fecharDetalhes();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do pedido");
    } finally {
      setSalvando(false);
    }
  };

  const filtros = [
    "TODOS",
    ...Object.keys(STATUS_PEDIDO).filter((s) => contagem[s]),
  ];

  return (
    <>
      <div className="pn-header">
        <div>
          <h1>Pedidos</h1>
          <p>Acompanhe e atualize os pedidos da sua loja</p>
        </div>
      </div>

      {loading ? (
        <div className="pn-loading">
          <Spinner animation="border" variant="danger" />
        </div>
      ) : pedidos.length === 0 ? (
        <div className="pn-card pn-empty">
          <i className="bi bi-receipt" />
          <h5>Nenhum pedido ainda</h5>
          <p className="mb-0">Assim que um cliente fizer um pedido, ele aparece aqui.</p>
        </div>
      ) : (
        <>
          <div className="pn-chips">
            {filtros.map((s) => (
              <button
                key={s}
                className={`pn-chip ${filtro === s ? "active" : ""}`}
                onClick={() => setFiltro(s)}
              >
                {s === "TODOS" ? "Todos" : statusInfo(s).label}
                <span className="pn-chip-count">
                  {s === "TODOS" ? pedidos.length : contagem[s]}
                </span>
              </button>
            ))}
          </div>

          <div className="pn-grid">
            {pedidosFiltrados.map((pedido) => {
              const st = statusInfo(pedido.status);
              const pag = PAGAMENTO_STATUS[pedido.pagamentoStatus];

              return (
                <div
                  key={pedido.id}
                  className="pn-card pn-order"
                  onClick={() => abrirDetalhes(pedido)}
                >
                  <div className="pn-order-head">
                    <div>
                      <div className="pn-order-id">#{pedido.id}</div>
                      <div className="pn-order-meta">
                        <i className="bi bi-person" />
                        {pedido.cliente?.nome || "Cliente"}
                      </div>
                      {pedido.dataCriacao && (
                        <div className="pn-order-meta">
                          <i className="bi bi-clock" />
                          {formatarData(pedido.dataCriacao)}
                        </div>
                      )}
                    </div>
                    <span className={`pn-badge pn-tone-${st.tone}`}>{st.label}</span>
                  </div>

                  <ul className="pn-order-items">
                    {pedido.itens?.slice(0, 3).map((item, index) => (
                      <li key={index}>
                        <span className="pn-qty">{item.quantidade}x</span>
                        <span>{item.produto?.nome}</span>
                      </li>
                    ))}
                    {pedido.itens?.length > 3 && (
                      <li className="text-muted">+ {pedido.itens.length - 3} item(ns)</li>
                    )}
                  </ul>

                  <div className="pn-order-foot">
                    <div className="pn-total">
                      <small>Total</small>
                      {formatarPreco(pedido.valorTotal)}
                    </div>
                    {pedido.metodoPagamento && (
                      <span className={`pn-badge plain pn-tone-${pag?.tone || "gray"}`}>
                        {PAGAMENTO[pedido.metodoPagamento] || pedido.metodoPagamento}
                        {pag && ` · ${pag.label}`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {pedidosFiltrados.length === 0 && (
            <div className="pn-card pn-empty">
              <i className="bi bi-funnel" />
              <h5>Nenhum pedido com esse status</h5>
            </div>
          )}
        </>
      )}

      {/* MODAL */}
      <Modal
        show={showModal}
        onHide={fecharDetalhes}
        size="lg"
        centered
        className="pn-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Pedido #{pedidoSelecionado?.id}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="pn-info-row">
            <div>
              <span>Cliente</span>
              <strong>{pedidoSelecionado?.cliente?.nome || "—"}</strong>
            </div>
            {pedidoSelecionado?.cliente?.foneCelular && (
              <div>
                <span>Telefone</span>
                <strong>{pedidoSelecionado.cliente.foneCelular}</strong>
              </div>
            )}
            {pedidoSelecionado?.dataCriacao && (
              <div>
                <span>Data</span>
                <strong>{formatarData(pedidoSelecionado.dataCriacao)}</strong>
              </div>
            )}
            {pedidoSelecionado?.metodoPagamento && (
              <div>
                <span>Pagamento</span>
                <strong>
                  {PAGAMENTO[pedidoSelecionado.metodoPagamento] ||
                    pedidoSelecionado.metodoPagamento}
                  {PAGAMENTO_STATUS[pedidoSelecionado.pagamentoStatus] &&
                    ` · ${PAGAMENTO_STATUS[pedidoSelecionado.pagamentoStatus].label}`}
                </strong>
              </div>
            )}
          </div>

          <h6 className="pn-section-title">Atualizar status</h6>
          <div className="pn-status-picker mb-4">
            {STATUS_EDITAVEIS.map((s) => (
              <button
                key={s}
                type="button"
                className={`pn-status-option ${novoStatus === s ? "active" : ""}`}
                onClick={() => setNovoStatus(s)}
              >
                <i className={`bi ${statusInfo(s).icon}`} />
                {statusInfo(s).label}
              </button>
            ))}
          </div>

          <h6 className="pn-section-title">Itens</h6>
          <div>
            {pedidoSelecionado?.itens?.map((item, index) => (
              <div key={index} className="pn-line-item">
                <div>
                  <div className="fw-semibold">
                    <span className="pn-qty">{item.quantidade}x</span>
                    {item.produto?.nome}
                  </div>
                  {item.produto?.descricao && (
                    <div className="small text-muted">{item.produto.descricao}</div>
                  )}
                </div>
                <div className="fw-semibold text-nowrap">
                  {formatarPreco(item.subtotal)}
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
            <span className="fw-semibold">Total</span>
            <span className="pn-total" style={{ color: "var(--pn-red)" }}>
              {formatarPreco(pedidoSelecionado?.valorTotal)}
            </span>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button className="pn-btn pn-btn-ghost" onClick={fecharDetalhes}>
            Fechar
          </button>
          <button
            className="pn-btn pn-btn-primary"
            onClick={atualizarStatus}
            disabled={salvando || novoStatus === pedidoSelecionado?.status}
          >
            {salvando ? "Salvando..." : "Salvar status"}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
