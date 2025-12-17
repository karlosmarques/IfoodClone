import React from "react";

const pedidosFake = [
  {
    id: 10,
    data: "25/11/2025",
    total: "R$ 89,90",
    status: "Entregue"
  },
  {
    id: 12,
    data: "20/11/2025",
    total: "R$ 45,00",
    status: "Cancelado"
  }
];

export default function HistoricoPedidos() {
  return (
    <div className="card p-3 shadow-sm">
      <h5 className="mb-3">📋 Histórico de Pedidos</h5>

      {pedidosFake.map((pedido) => (
        <div key={pedido.id} className="border rounded p-2 mb-2">
          <p><strong>Pedido #{pedido.id}</strong></p>
          <p>Data: {pedido.data}</p>
          <p>Total: {pedido.total}</p>
          <p>Status: {pedido.status}</p>
        </div>
      ))}
    </div>
  );
}
