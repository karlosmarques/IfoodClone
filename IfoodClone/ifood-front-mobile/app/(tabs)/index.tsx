import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SacolaFlutuante from '@/components/botSacola';
import { cores, imagemUrl, sombra } from '@/constants/ui';
import { API_BASE_URL } from "../config";

type Loja = {
  idRestaurante: number;
  nome: string;
  urlImagem: string;
  raio_entrega?: string;
  categoria?: { id: number; nome: string; urlImagem: string };
};

type Categoria = {
  id: number;
  nome: string;
  urlImagem: string;
};

type RootStackParamList = {
  ProdutosRestaurante: { id: number };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BANNERS = [
  {
    titulo: 'Fome de pizza?',
    sub: 'As melhores pizzarias perto de você',
    uri: 'https://raw.githubusercontent.com/ViniciusX22/onebitfood/master/public/images/categories/italian.jpeg',
  },
  {
    titulo: 'Japonesa hoje',
    sub: 'Sushis e temakis fresquinhos',
    uri: 'https://raw.githubusercontent.com/ViniciusX22/onebitfood/master/public/images/categories/japonese.jpeg',
  },
  {
    titulo: 'Leve e saudável',
    sub: 'Opções veganas e naturais',
    uri: 'https://raw.githubusercontent.com/ViniciusX22/onebitfood/master/public/images/categories/vegan.jpeg',
  },
  {
    titulo: 'Sabores do mundo',
    sub: 'Mexicana, árabe e muito mais',
    uri: 'https://raw.githubusercontent.com/ViniciusX22/onebitfood/master/public/images/categories/mexican.jpg',
  },
];

// Nota "fixa" por loja, já que o backend ainda não tem avaliações
function notaDaLoja(id: number) {
  return (4.3 + ((id * 7) % 7) / 10).toFixed(1);
}

export default function Principal() {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
  const router = useRouter();

  // Carregar lojas
  useEffect(() => {
    async function carregarLojas() {
      try {
        const token = await AsyncStorage.getItem("token");

        const response = await axios.get(
          `${API_BASE_URL}/restaurante/mobile`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const dados = Array.isArray(response.data)
          ? response.data
          : response.data.lojas || [];

        setLojas(dados);
      } catch (error) {
        console.error("Erro ao carregar lojas:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarLojas();
  }, []);

  // Carregar categorias
  useEffect(() => {
    async function carregarCategorias() {
      try {
        const token = await AsyncStorage.getItem("token");

        const response = await axios.get(
          `${API_BASE_URL}/categorias/restaurantes`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const dados = Array.isArray(response.data)
          ? response.data
          : response.data.categorias || [];

        setCategorias(dados);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }

    carregarCategorias();
  }, []);

  // Filtrar lojas pela categoria selecionada
  const lojasFiltradas = categoriaSelecionada
    ? lojas.filter((l) => l.categoria?.id === categoriaSelecionada)
    : lojas;

  // Clicar de novo na categoria remove o filtro
  const handleCategoriaClick = (categoriaId: number) => {
    setCategoriaSelecionada(categoriaId === categoriaSelecionada ? null : categoriaId);
  };

  const categoriaAtual = categorias.find((c) => c.id === categoriaSelecionada);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TOPO */}
        <View style={styles.topo}>
          <View>
            <Text style={styles.entregarEm}>Entregar em</Text>
            <View style={styles.enderecoLinha}>
              <Ionicons name="location" size={16} color={cores.vermelho} />
              <Text style={styles.endereco}>Seu endereço</Text>
              <Ionicons name="chevron-down" size={16} color={cores.texto} />
            </View>
          </View>
          <TouchableOpacity style={styles.iconeTopo} onPress={() => router.push('/pedidos')}>
            <Ionicons name="receipt-outline" size={22} color={cores.texto} />
          </TouchableOpacity>
        </View>

        {/* BUSCA (atalho) */}
        <TouchableOpacity
          style={styles.busca}
          activeOpacity={0.8}
          onPress={() => router.push('/busca')}
        >
          <Ionicons name="search" size={20} color={cores.vermelho} />
          <Text style={styles.buscaTexto}>Buscar restaurantes e pratos</Text>
        </TouchableOpacity>

        {/* CATEGORIAS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriasScroll}
        >
          {categorias.map((c) => {
            const ativa = c.id === categoriaSelecionada;
            const img = imagemUrl(c.urlImagem);
            return (
              <TouchableOpacity
                key={c.id}
                style={styles.categoria}
                onPress={() => handleCategoriaClick(c.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.categoriaImgBox, ativa && styles.categoriaAtiva]}>
                  {img ? (
                    <Image source={{ uri: img }} style={styles.categoriaImg} />
                  ) : (
                    <Ionicons name="restaurant-outline" size={26} color={cores.textoSuave} />
                  )}
                </View>
                <Text
                  style={[styles.categoriaNome, ativa && { color: cores.vermelho }]}
                  numberOfLines={1}
                >
                  {c.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* BANNERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bannersScroll}
          snapToInterval={292}
          decelerationRate="fast"
        >
          {BANNERS.map((b) => (
            <View key={b.titulo} style={styles.banner}>
              <Image source={{ uri: b.uri }} style={styles.bannerImg} />
              <View style={styles.bannerOverlay} />
              <View style={styles.bannerTexto}>
                <Text style={styles.bannerTitulo}>{b.titulo}</Text>
                <Text style={styles.bannerSub}>{b.sub}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* LOJAS */}
        <View style={styles.secao}>
          <View style={styles.secaoTopo}>
            <Text style={styles.secaoTitulo}>
              {categoriaAtual ? categoriaAtual.nome : 'Lojas'}
            </Text>
            {categoriaAtual && (
              <TouchableOpacity onPress={() => setCategoriaSelecionada(null)}>
                <Text style={styles.limparFiltro}>Ver todas</Text>
              </TouchableOpacity>
            )}
          </View>

          {loading && <ActivityIndicator color={cores.vermelho} style={{ marginTop: 24 }} />}

          {!loading && lojasFiltradas.length === 0 && (
            <View style={styles.vazio}>
              <Ionicons name="storefront-outline" size={40} color="#C8C8CF" />
              <Text style={styles.vazioTexto}>Nenhuma loja encontrada</Text>
            </View>
          )}

          {lojasFiltradas.map((l) => {
            const img = imagemUrl(l.urlImagem);
            return (
              <TouchableOpacity
                key={l.idRestaurante}
                style={styles.loja}
                onPress={() =>
                  navigation.navigate("ProdutosRestaurante", {
                    id: l.idRestaurante,
                  })
                }
                activeOpacity={0.8}
              >
                {img ? (
                  <Image style={styles.lojaImg} source={{ uri: img }} />
                ) : (
                  <View style={[styles.lojaImg, styles.semImagem]}>
                    <Ionicons name="storefront-outline" size={28} color={cores.textoSuave} />
                  </View>
                )}

                <View style={styles.lojaInfo}>
                  <Text style={styles.lojaNome} numberOfLines={1}>{l.nome}</Text>
                  <View style={styles.lojaLinha}>
                    <Ionicons name="star" size={13} color="#F5A623" />
                    <Text style={styles.nota}>{notaDaLoja(l.idRestaurante)}</Text>
                    <Text style={styles.ponto}>•</Text>
                    <Text style={styles.lojaDetalhe}>{l.categoria?.nome || 'Restaurante'}</Text>
                    {l.raio_entrega ? (
                      <>
                        <Text style={styles.ponto}>•</Text>
                        <Text style={styles.lojaDetalhe}>{l.raio_entrega} km</Text>
                      </>
                    ) : null}
                  </View>
                  <View style={styles.lojaLinha}>
                    <Text style={styles.lojaDetalhe}>30-45 min</Text>
                    <Text style={styles.ponto}>•</Text>
                    <Text style={styles.entregaGratis}>Entrega grátis</Text>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#C8C8CF" />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 96 }} />
      </ScrollView>

      <SacolaFlutuante />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },

  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  entregarEm: { fontSize: 12, color: cores.textoSuave, fontWeight: '500' },
  enderecoLinha: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  endereco: { fontSize: 16, fontWeight: '700', color: cores.texto },
  iconeTopo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: cores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    ...sombra,
  },

  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14,
    backgroundColor: cores.superficie,
    ...sombra,
  },
  buscaTexto: { color: cores.textoSuave, fontSize: 15 },

  categoriasScroll: { paddingHorizontal: 12, paddingTop: 20, paddingBottom: 4 },
  categoria: { alignItems: 'center', width: 76, marginHorizontal: 4 },
  categoriaImgBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: cores.superficie,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 6,
  },
  categoriaAtiva: { borderColor: cores.vermelho },
  categoriaImg: { width: '100%', height: '100%' },
  categoriaNome: { fontSize: 12, fontWeight: '600', color: cores.texto },

  bannersScroll: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  banner: {
    width: 280,
    height: 140,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#DDD',
  },
  bannerImg: { width: '100%', height: '100%' },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  bannerTexto: { position: 'absolute', left: 16, bottom: 14, right: 16 },
  bannerTitulo: { color: '#fff', fontSize: 20, fontWeight: '800' },
  bannerSub: { color: '#fff', fontSize: 13, marginTop: 2, opacity: 0.9 },

  secao: { paddingHorizontal: 16, marginTop: 24 },
  secaoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  secaoTitulo: { fontSize: 20, fontWeight: '800', color: cores.texto },
  limparFiltro: { color: cores.vermelho, fontWeight: '700' },

  loja: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.superficie,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    ...sombra,
  },
  lojaImg: { width: 64, height: 64, borderRadius: 14, backgroundColor: cores.fundo },
  semImagem: { alignItems: 'center', justifyContent: 'center' },
  lojaInfo: { flex: 1, marginLeft: 12, gap: 3 },
  lojaNome: { fontSize: 16, fontWeight: '700', color: cores.texto },
  lojaLinha: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  nota: { fontSize: 13, fontWeight: '700', color: '#B07A00' },
  ponto: { color: '#C8C8CF', fontSize: 12 },
  lojaDetalhe: { fontSize: 13, color: cores.textoSuave },
  entregaGratis: { fontSize: 13, color: cores.verde, fontWeight: '600' },

  vazio: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  vazioTexto: { color: cores.textoSuave, fontSize: 15 },
});
