import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { API_BASE_URL } from "../app/config";
import SacolaFlutuante from "../components/botSacola";
import { cores, formatarPreco, imagemUrl, sombra } from "../constants/ui";
import { useAdicionarNaSacola, useSacola } from "../context/SacolaContext";

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
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { itens } = useSacola();
  const adicionar = useAdicionarNaSacola();

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
    } finally {
      setLoading(false);
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

  const qtdNaSacola = (idProduto: number) =>
    itens.find((i) => i.produto.idProduto === idProduto)?.quantidade || 0;

  const logo = imagemUrl(restaurante?.urlImagem);

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]}>
        {/* CAPA */}
        <View style={styles.capa}>
          {logo && <Image source={{ uri: logo }} style={styles.capaImg} blurRadius={12} />}
          <View style={styles.capaOverlay} />
          <SafeAreaView edges={["top"]} style={styles.capaBotoes}>
            <TouchableOpacity style={styles.botaoRedondo} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={cores.texto} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* INFO DA LOJA */}
        <View style={styles.infoCard}>
          {logo ? (
            <Image source={{ uri: logo }} style={styles.logo} />
          ) : (
            <View style={[styles.logo, styles.semImagem]}>
              <Ionicons name="storefront-outline" size={28} color={cores.textoSuave} />
            </View>
          )}
          <Text style={styles.nomeLoja}>{restaurante?.nome || "Restaurante"}</Text>
          <View style={styles.infoLinha}>
            <Ionicons name="star" size={14} color="#F5A623" />
            <Text style={styles.nota}>4,7</Text>
            <Text style={styles.ponto}>•</Text>
            <Text style={styles.infoTexto}>{restaurante?.categoria?.nome}</Text>
            {restaurante?.raio_entrega ? (
              <>
                <Text style={styles.ponto}>•</Text>
                <Text style={styles.infoTexto}>até {restaurante.raio_entrega} km</Text>
              </>
            ) : null}
          </View>
          <View style={styles.tags}>
            <View style={styles.tag}>
              <Ionicons name="time-outline" size={14} color={cores.texto} />
              <Text style={styles.tagTexto}>30-45 min</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: cores.verdeClaro }]}>
              <Ionicons name="bicycle-outline" size={14} color={cores.verde} />
              <Text style={[styles.tagTexto, { color: cores.verde }]}>Entrega grátis</Text>
            </View>
          </View>
        </View>

        {/* BUSCA + CATEGORIAS (fixo ao rolar) */}
        <View style={styles.filtros}>
          <View style={styles.busca}>
            <Ionicons name="search" size={18} color={cores.textoSuave} />
            <TextInput
              placeholder="Buscar no cardápio"
              placeholderTextColor={cores.textoSuave}
              value={busca}
              onChangeText={setBusca}
              style={styles.buscaInput}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {[{ id_categoria: -1, nome: "Todos" }, ...categorias].map((c) => {
              const ativo =
                c.id_categoria === -1 ? categoriaAtiva === null : categoriaAtiva === c.id_categoria;
              return (
                <TouchableOpacity
                  key={c.id_categoria}
                  style={[styles.chip, ativo && styles.chipAtivo]}
                  onPress={() => setCategoriaAtiva(c.id_categoria === -1 ? null : c.id_categoria)}
                >
                  <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>{c.nome}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* PRODUTOS */}
        <View style={styles.produtos}>
          {loading && <ActivityIndicator color={cores.vermelho} style={{ marginTop: 24 }} />}

          {!loading && produtosFiltrados.length === 0 && (
            <View style={styles.vazio}>
              <Ionicons name="fast-food-outline" size={40} color="#C8C8CF" />
              <Text style={styles.vazioTexto}>Nenhum produto encontrado</Text>
            </View>
          )}

          {produtosFiltrados.map((p) => {
            const img = imagemUrl(p.urlImagem);
            const qtd = qtdNaSacola(p.idProduto);
            return (
              <TouchableOpacity
                key={p.idProduto}
                style={styles.produto}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/produtos/[id]",
                    params: { id: p.idProduto, restaurante: id },
                  })
                }
              >
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={styles.prodNome}>{p.nome}</Text>
                  <Text style={styles.prodDesc} numberOfLines={2}>{p.descricao}</Text>
                  <Text style={styles.prodPreco}>{formatarPreco(p.preco)}</Text>
                </View>

                <View>
                  {img ? (
                    <Image source={{ uri: img }} style={styles.prodImg} />
                  ) : (
                    <View style={[styles.prodImg, styles.semImagem]}>
                      <Ionicons name="image-outline" size={28} color={cores.textoSuave} />
                    </View>
                  )}

                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      adicionar(p, Number(id));
                    }}
                    style={({ pressed }) => [
                      styles.addButton,
                      qtd > 0 && styles.addButtonComQtd,
                      pressed && { transform: [{ scale: 0.92 }] },
                    ]}
                  >
                    {qtd > 0 ? (
                      <Text style={styles.addQtd}>{qtd}</Text>
                    ) : (
                      <Ionicons name="add" size={22} color={cores.vermelho} />
                    )}
                  </Pressable>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <SacolaFlutuante />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },

  /* CAPA */
  capa: { height: 170, backgroundColor: cores.vermelho, overflow: "hidden" },
  capaImg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  capaOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(234,29,44,0.55)" },
  capaBotoes: { paddingHorizontal: 16, paddingTop: 8 },
  botaoRedondo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    ...sombra,
  },

  /* INFO */
  infoCard: {
    marginHorizontal: 16,
    marginTop: -50,
    backgroundColor: cores.superficie,
    borderRadius: 20,
    padding: 16,
    paddingTop: 44,
    alignItems: "center",
    ...sombra,
  },
  logo: {
    position: "absolute",
    top: -36,
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: cores.fundo,
  },
  semImagem: { alignItems: "center", justifyContent: "center" },
  nomeLoja: { fontSize: 20, fontWeight: "800", color: cores.texto, textAlign: "center" },
  infoLinha: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  nota: { fontSize: 13, fontWeight: "700", color: "#B07A00" },
  ponto: { color: "#C8C8CF" },
  infoTexto: { fontSize: 13, color: cores.textoSuave },
  tags: { flexDirection: "row", gap: 8, marginTop: 12 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: cores.fundo,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagTexto: { fontSize: 12, fontWeight: "600", color: cores.texto },

  /* FILTROS */
  filtros: { backgroundColor: cores.fundo, paddingTop: 16 },
  busca: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  buscaInput: { flex: 1, fontSize: 15, color: cores.texto, height: "100%" },
  chips: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  chipAtivo: { backgroundColor: cores.texto, borderColor: cores.texto },
  chipTexto: { color: cores.texto, fontWeight: "600", fontSize: 13 },
  chipTextoAtivo: { color: "#fff" },

  /* PRODUTOS */
  produtos: { paddingHorizontal: 16 },
  produto: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.superficie,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    ...sombra,
  },
  prodNome: { fontSize: 16, fontWeight: "700", color: cores.texto },
  prodDesc: { color: cores.textoSuave, fontSize: 13, marginVertical: 6, lineHeight: 18 },
  prodPreco: { fontSize: 16, fontWeight: "800", color: cores.texto },
  prodImg: { width: 104, height: 104, borderRadius: 14, backgroundColor: cores.fundo },

  addButton: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: "#fff",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: cores.borda,
    ...sombra,
  },
  addButtonComQtd: { backgroundColor: cores.vermelho, borderColor: cores.vermelho },
  addQtd: { color: "#fff", fontWeight: "800", fontSize: 15 },

  vazio: { alignItems: "center", paddingVertical: 40, gap: 8 },
  vazioTexto: { color: cores.textoSuave, fontSize: 15 },
});
