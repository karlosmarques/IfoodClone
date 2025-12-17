import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { API_BASE_URL } from "../app/config";
import SacolaFlutuante from "../components/botSacola";
import { useSacola } from "../context/SacolaContext";

/* ================= INTERFACES ================= */
interface Categoria {
  id_categoria: number;
  nome: string;
}

interface Produto {
  idProduto: number;
  nome: string;
  descricao: string;
  preco: number;
  ativo: boolean;
  urlImagem: string | null;
  categoria: Categoria;
  idRestaurante: number;
}

interface Restaurante {
  idRestaurante: number;
  nome: string;
  telefone: string;
  cnpj: string;
  raio_entrega: string;
  urlImagem: string | null;
  categoria: {
    id: number;
    nome: string;
  };
}

interface RouteParams {
  id: string | number;
}

/* ================= COMPONENT ================= */
export default function ProdutosRestaurante() {
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<number | null>(null);
  const [busca, setBusca] = useState("");

  const router = useRouter();
  const { adicionar } = useSacola();

  /* ================= API ================= */
  async function carregarRestaurante() {
    try {
      const resp = await axios.get(`${API_BASE_URL}/restaurante/mobile`);
      const encontrado = resp.data.find(
        (r: Restaurante) => r.idRestaurante === Number(id)
      );
      if (encontrado) setRestaurante(encontrado);
    } catch (error) {
      console.error("Erro ao carregar restaurante:", error);
    }
  }

  async function carregarProdutos() {
    try {
      const resp = await axios.get(
        `${API_BASE_URL}/produtos/restaurante/${id}`
      );

      const produtosComRestaurante = resp.data.map((p: Produto) => ({
        ...p,
        idRestaurante: Number(id),
      }));

      setProdutos(produtosComRestaurante);

      const categoriasUnicas: Categoria[] = [];
      produtosComRestaurante.forEach((p: Produto) => {
        if (
          p.categoria &&
          !categoriasUnicas.some(
            (c) => c.id_categoria === p.categoria.id_categoria
          )
        ) {
          categoriasUnicas.push(p.categoria);
        }
      });

      setCategorias(categoriasUnicas);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  }

  useEffect(() => {
    carregarRestaurante();
    carregarProdutos();
  }, []);

  /* ================= FILTROS ================= */
  const produtosFiltrados = produtos.filter((p) => {
    const matchCategoria =
      categoriaAtiva === null ||
      p.categoria?.id_categoria === categoriaAtiva;

    const matchBusca =
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.descricao.toLowerCase().includes(busca.toLowerCase());

    return matchCategoria && matchBusca;
  });

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      {/* ===== TOP BAR ===== */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push("/")}>
    <Text style={styles.backButton}>←</Text>
  </TouchableOpacity>

        <Text style={styles.topTitle} numberOfLines={1}>
          {restaurante?.nome || "Restaurante"}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 56 }}
      >
        {/* HEADER */}
        {restaurante && (
          <View style={styles.headerContainer}>
            <Image
              source={{
                uri: restaurante.urlImagem
                  ? `${API_BASE_URL}${restaurante.urlImagem.replace(/\\/g, "/")}`
                  : "https://via.placeholder.com/400x200",
              }}
              style={styles.headerImage}
            />
            <View style={styles.headerOverlay} />
            <View style={styles.headerContent}>
              <Text style={styles.restaurantName}>{restaurante.nome}</Text>
              <View style={styles.restaurantInfo}>
                <Text style={styles.infoText}>⭐ 4.5</Text>
                <Text style={styles.infoDivider}> | </Text>
                <Text style={styles.infoText}>
                  🛵 {restaurante.raio_entrega} km
                </Text>
                <Text style={styles.infoDivider}> | </Text>
                <Text style={styles.infoText}>
                  🏷️ {restaurante.categoria.nome}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* BUSCA */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Buscar no cardápio"
            value={busca}
            onChangeText={setBusca}
            style={styles.input}
          />
        </View>

        {/* CATEGORIAS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.catItem, categoriaAtiva === null && styles.catAtiva]}
            onPress={() => setCategoriaAtiva(null)}
          >
            <Text style={styles.catTexto}>Todos</Text>
          </TouchableOpacity>

          {categorias.map((c) => (
            <TouchableOpacity
              key={c.id_categoria}
              style={[
                styles.catItem,
                categoriaAtiva === c.id_categoria && styles.catAtiva,
              ]}
              onPress={() => setCategoriaAtiva(c.id_categoria)}
            >
              <Text style={styles.catTexto}>{c.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* PRODUTOS */}
        <View style={styles.produtosContainer}>
          {produtosFiltrados.map((p) => (
            <TouchableOpacity
              key={p.idProduto}
              style={styles.prodCard}
              onPress={() => router.push(`/produtos/${p.idProduto}`)}
            >
              <View style={styles.prodContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.prodNome}>{p.nome}</Text>
                  <Text style={styles.prodDesc}>{p.descricao}</Text>
                  <Text style={styles.prodPreco}>
                    R$ {p.preco.toFixed(2)}
                  </Text>
                </View>

                <View>
                  <Image
                    source={{
                      uri: p.urlImagem
                        ? `${API_BASE_URL}${p.urlImagem.replace(/\\/g, "/")}`
                        : "https://via.placeholder.com/120",
                    }}
                    style={styles.prodImg}
                  />

                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      adicionar(p, Number(id));
                    }}
                    style={({ pressed }) => [
                      styles.addButton,
                      pressed && styles.addButtonPressed,
                    ]}
                  >
                    <Text style={styles.addButtonText}>+</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <SacolaFlutuante />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },

  /* TOP BAR */
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 10,
    elevation: 4,
  },
  

  backButton: {
    position: "absolute",
    left: -300,
    fontSize: 28,
  },

 

  topTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    maxWidth: "70%",
    textAlign: "center",
  },

  headerContainer: { height: 240 },
  headerImage: { width: "100%", height: "100%" },
  headerOverlay: {
    position: "absolute",
    bottom: 0,
    height: "50%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  headerContent: { position: "absolute", bottom: 20, left: 20 },

  restaurantName: { fontSize: 26, color: "#fff", fontWeight: "700" },
  restaurantInfo: { flexDirection: "row", marginTop: 8 },
  infoText: { color: "#fff", fontWeight: "600" },
  infoDivider: { color: "#fff", marginHorizontal: 6 },

  searchContainer: { padding: 16 },
  input: { backgroundColor: "#eee", borderRadius: 8, padding: 12 },

  catItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  catAtiva: { backgroundColor: "#EA1D2C", borderColor: "#EA1D2C" },
  catTexto: { color: "#000", fontWeight: "600" },

  produtosContainer: { padding: 16 },

  prodCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    elevation: 2,
  },
  prodContent: { flexDirection: "row" },

  prodNome: { fontSize: 16, fontWeight: "700" },
  prodDesc: { color: "#666", marginVertical: 4 },
  prodPreco: { fontSize: 16, fontWeight: "700" },

  prodImg: { width: 120, height: 120, borderRadius: 8 },

  addButton: {
    position: "absolute",
    bottom: -12,
    right: -12,
    backgroundColor: "#EA1D2C",
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

  addButtonPressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.85,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    lineHeight: 28,
  },
});
