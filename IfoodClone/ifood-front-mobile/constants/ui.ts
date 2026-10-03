// Tema visual e helpers compartilhados pelas telas do app
import { API_BASE_URL } from "../app/config";

export const cores = {
  vermelho: "#EA1D2C",
  vermelhoEscuro: "#C4121F",
  vermelhoClaro: "#FFF1F2",
  fundo: "#F5F5F7",
  superficie: "#FFFFFF",
  borda: "#ECECEF",
  texto: "#1F1F24",
  textoSuave: "#717179",
  verde: "#12854B",
  verdeClaro: "#E6F7EE",
};

export const sombra = {
  shadowColor: "#101014",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 12,
  elevation: 2,
};

export function formatarPreco(valor: number | string | null | undefined) {
  return `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;
}

export function imagemUrl(caminho?: string | null) {
  return caminho ? `${API_BASE_URL}${caminho.replace(/\\/g, "/")}` : null;
}

type Tom = { label: string; cor: string; fundo: string; icone: string };

export const STATUS_PEDIDO: Record<string, Tom> = {
  AGUARDANDO_PAGAMENTO: { label: "Aguardando pagamento", cor: "#55555E", fundo: "#F0F0F3", icone: "hourglass-outline" },
  REALIZADO: { label: "Pedido recebido", cor: "#1F62D6", fundo: "#E8F1FF", icone: "receipt-outline" },
  EM_PREPARO: { label: "Em preparo", cor: "#B46A00", fundo: "#FFF4E0", icone: "flame-outline" },
  SAIU_PARA_ENTREGA: { label: "Saiu para entrega", cor: "#6D3FD1", fundo: "#F1EAFF", icone: "bicycle-outline" },
  ENTREGUE: { label: "Entregue", cor: "#12854B", fundo: "#E6F7EE", icone: "checkmark-circle-outline" },
  CANCELADO: { label: "Cancelado", cor: "#C4121F", fundo: "#FFECEE", icone: "close-circle-outline" },
};

export function statusPedido(status: string): Tom {
  return STATUS_PEDIDO[status] || { label: status, cor: "#55555E", fundo: "#F0F0F3", icone: "ellipse-outline" };
}

export const PAGAMENTO: Record<string, string> = {
  PIX: "PIX",
  CARTAO: "Cartão",
  DINHEIRO: "Dinheiro",
};
