import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

/* ================== TIPOS ================== */
type Produto = {
  idProduto: number;
  nome: string;
  preco: number;
  urlImagem?: string | null;
};

type ItemSacola = {
  produto: Produto;
  quantidade: number;
};

type SacolaContextType = {
  itens: ItemSacola[];
  idRestaurante: number | null;
  adicionar: (
    produto: Produto,
    idRestaurante: number,
    qtd?: number
  ) => void;
  remover: (idProduto: number) => void;
  limpar: () => void;
  substituir: (produto: Produto, idRestaurante: number, qtd?: number) => void;
  total: number;
  montarPayload: () =>
    | {
        idRestaurante: number;
        itens: { idProduto: number; quantidade: number }[];
      }
    | null;
};

/* ================== CONTEXT ================== */
const SacolaContext = createContext<SacolaContextType>(
  {} as SacolaContextType
);

/* ================== PROVIDER ================== */
export function SacolaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [itens, setItens] = useState<ItemSacola[]>([]);
  const [idRestaurante, setIdRestaurante] = useState<number | null>(null);
  const [carregado, setCarregado] = useState(false);

  /* 🔹 CARREGAR sacola salva */
  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem("@sacola");
        if (data) {
          const parsed = JSON.parse(data);
          setItens(parsed.itens || []);
          setIdRestaurante(parsed.idRestaurante || null);
        }
      } catch (e) {
        console.log("Erro ao carregar sacola", e);
      } finally {
        setCarregado(true);
      }
    })();
  }, []);

  /* 🔹 SALVAR sempre que mudar */
  useEffect(() => {
    if (carregado) {
      AsyncStorage.setItem(
        "@sacola",
        JSON.stringify({ itens, idRestaurante })
      );
    }
  }, [itens, idRestaurante, carregado]);

  /* ================== FUNÇÕES ================== */
  function adicionar(produto: Produto, restauranteId: number, qtd = 1) {
    setItens((prev) => {
      if (idRestaurante && idRestaurante !== restauranteId) {
        console.log("Sacola já pertence a outro restaurante");
        return prev; // opcional: você pode alertar o usuário
      }

      if (!idRestaurante) {
        setIdRestaurante(restauranteId);
      }

      const existe = prev.find(
        (i) => i.produto.idProduto === produto.idProduto
      );

      if (existe) {
        return prev.map((i) =>
          i.produto.idProduto === produto.idProduto
            ? { ...i, quantidade: i.quantidade + qtd }
            : i
        );
      }

      return [...prev, { produto, quantidade: qtd }];
    });
  }

  function remover(idProduto: number) {
    setItens((prev) =>
      prev
        .map((i) =>
          i.produto.idProduto === idProduto
            ? { ...i, quantidade: i.quantidade - 1 }
            : i
        )
        .filter((i) => i.quantidade > 0)
    );
  }

  function limpar() {
    setItens([]);
    setIdRestaurante(null);
  }

  // Troca todo o conteúdo da sacola por um item de outra loja
  function substituir(produto: Produto, restauranteId: number, qtd = 1) {
    setItens([{ produto, quantidade: qtd }]);
    setIdRestaurante(restauranteId);
  }

  const total = itens.reduce(
    (acc, i) => acc + i.produto.preco * i.quantidade,
    0
  );

  function montarPayload() {
    if (!idRestaurante || itens.length === 0) return null;

    return {
      idRestaurante,
      itens: itens.map((i) => ({
        idProduto: i.produto.idProduto,
        quantidade: i.quantidade,
      })),
    };
  }

  return (
    <SacolaContext.Provider
      value={{
        itens,
        idRestaurante,
        adicionar,
        remover,
        limpar,
        substituir,
        total,
        montarPayload,
      }}
    >
      {children}
    </SacolaContext.Provider>
  );
}

/* ================== HOOK ================== */
export const useSacola = () => useContext(SacolaContext);

/* Adiciona à sacola avisando quando ela já tem itens de outra loja */
export function useAdicionarNaSacola() {
  const { adicionar, substituir, idRestaurante, itens } = useSacola();

  return (produto: Produto, restauranteId: number, qtd = 1) => {
    if (idRestaurante && idRestaurante !== restauranteId) {
      // Sacola vazia mas ainda "presa" à loja anterior: só troca
      if (itens.length === 0) {
        substituir(produto, restauranteId, qtd);
        return true;
      }

      const titulo = "Sacola de outra loja";
      const msg =
        "Sua sacola tem itens de outro restaurante. Deseja limpar a sacola e adicionar este item?";

      if (Platform.OS === "web") {
        // Alert com botões não funciona no navegador
        if (window.confirm(`${titulo}\n\n${msg}`)) {
          substituir(produto, restauranteId, qtd);
          return true;
        }
        return false;
      }

      Alert.alert(titulo, msg, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar e adicionar",
          style: "destructive",
          onPress: () => substituir(produto, restauranteId, qtd),
        },
      ]);
      return false;
    }

    adicionar(produto, restauranteId, qtd);
    return true;
  };
}
