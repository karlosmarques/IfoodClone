// Helpers compartilhados pelas telas do painel do restaurante

export const API_URL = "http://localhost:8081";

export const STATUS_PEDIDO = {
  AGUARDANDO_PAGAMENTO: { label: "Aguardando pagamento", tone: "gray", icon: "bi-hourglass-split" },
  REALIZADO: { label: "Novo pedido", tone: "blue", icon: "bi-bell" },
  EM_PREPARO: { label: "Em preparo", tone: "amber", icon: "bi-fire" },
  SAIU_PARA_ENTREGA: { label: "Saiu para entrega", tone: "purple", icon: "bi-bicycle" },
  ENTREGUE: { label: "Entregue", tone: "green", icon: "bi-check2-circle" },
  CANCELADO: { label: "Cancelado", tone: "red", icon: "bi-x-circle" },
};

export const PAGAMENTO = {
  PIX: "PIX",
  CARTAO: "Cartão",
  DINHEIRO: "Dinheiro",
};

export const PAGAMENTO_STATUS = {
  APROVADO: { label: "Pago", tone: "green" },
  PENDENTE: { label: "Pendente", tone: "amber" },
  RECUSADO: { label: "Recusado", tone: "red" },
  PAGAR_NA_ENTREGA: { label: "Na entrega", tone: "gray" },
};

export function statusInfo(status) {
  return STATUS_PEDIDO[status] || { label: status || "—", tone: "gray", icon: "bi-circle" };
}

export function formatarPreco(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarData(data) {
  if (!data) return "";
  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}
