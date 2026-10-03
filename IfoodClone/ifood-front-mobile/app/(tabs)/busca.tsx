import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cores, imagemUrl, sombra } from '@/constants/ui';
import { API_BASE_URL } from '../config';

/* =======================
   TIPOS
======================= */
type Restaurante = {
  idRestaurante: number;
  nome: string;
  urlImagem: string;
  raio_entrega?: string;
  categoria: {
    id: number;
    nome: string;
  };
};

type RootStackParamList = {
  ProdutosRestaurante: { id: number };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/* =======================
   COMPONENTE
======================= */
export default function Busca() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState<string | null>(null);
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================
     BUSCAR RESTAURANTES
  ======================= */
  useEffect(() => {
    async function fetchRestaurantes() {
      try {
        const response = await axios.get<Restaurante[]>(
          `${API_BASE_URL}/restaurante/mobile`
        );
        setRestaurantes(response.data);
      } catch (error) {
        console.error('Erro ao buscar restaurantes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurantes();
  }, []);

  const categorias = useMemo(
    () => [...new Set(restaurantes.map((r) => r.categoria?.nome).filter(Boolean))],
    [restaurantes]
  );

  /* =======================
     FILTRO
  ======================= */
  const termo = search.trim().toLowerCase();
  const restaurantesFiltrados = restaurantes.filter(
    (r) =>
      (!categoria || r.categoria?.nome === categoria) &&
      (!termo ||
        r.nome.toLowerCase().includes(termo) ||
        r.categoria?.nome?.toLowerCase().includes(termo))
  );

  /* =======================
     ITEM
  ======================= */
  const renderItem = ({ item }: { item: Restaurante }) => {
    const img = imagemUrl(item.urlImagem);
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('ProdutosRestaurante', {
            id: item.idRestaurante,
          })
        }
      >
        {img ? (
          <Image source={{ uri: img }} style={styles.cardImg} />
        ) : (
          <View style={[styles.cardImg, styles.semImagem]}>
            <Ionicons name="storefront-outline" size={32} color={cores.textoSuave} />
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.nome} numberOfLines={1}>{item.nome}</Text>
          <Text style={styles.categoria} numberOfLines={1}>
            {item.categoria?.nome}
            {item.raio_entrega ? ` • ${item.raio_entrega} km` : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.titulo}>Buscar</Text>

      <View style={styles.busca}>
        <Ionicons name="search" size={20} color={cores.vermelho} />
        <TextInput
          placeholder="O que vai pedir hoje?"
          placeholderTextColor={cores.textoSuave}
          onChangeText={setSearch}
          value={search}
          style={styles.buscaInput}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color="#C8C8CF" />
          </TouchableOpacity>
        )}
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {[null, ...categorias].map((c) => {
            const ativo = categoria === c;
            return (
              <TouchableOpacity
                key={c ?? 'todas'}
                style={[styles.chip, ativo && styles.chipAtivo]}
                onPress={() => setCategoria(c as string | null)}
              >
                <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>
                  {c ?? 'Todas'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={restaurantesFiltrados}
        renderItem={renderItem}
        keyExtractor={(item) => item.idRestaurante.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={cores.vermelho} style={{ marginTop: 32 }} />
          ) : (
            <View style={styles.vazio}>
              <Ionicons name="search-outline" size={40} color="#C8C8CF" />
              <Text style={styles.vazioTexto}>Nenhum restaurante encontrado</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

/* =======================
   ESTILOS
======================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: cores.texto,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    backgroundColor: cores.superficie,
    ...sombra,
  },
  buscaInput: { flex: 1, fontSize: 15, color: cores.texto, height: '100%' },

  chips: { paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  chipAtivo: { backgroundColor: cores.texto, borderColor: cores.texto },
  chipTexto: { color: cores.texto, fontWeight: '600', fontSize: 13 },
  chipTextoAtivo: { color: '#fff' },

  row: { gap: 12, marginBottom: 12 },
  card: {
    flex: 1,
    backgroundColor: cores.superficie,
    borderRadius: 16,
    overflow: 'hidden',
    ...sombra,
  },
  cardImg: { width: '100%', height: 110, backgroundColor: cores.fundo },
  semImagem: { alignItems: 'center', justifyContent: 'center' },
  cardInfo: { padding: 12 },
  nome: { color: cores.texto, fontSize: 15, fontWeight: '700' },
  categoria: { color: cores.textoSuave, fontSize: 12, marginTop: 2 },

  vazio: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  vazioTexto: { color: cores.textoSuave, fontSize: 15 },
});
