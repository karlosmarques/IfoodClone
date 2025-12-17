import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchBar } from '@rneui/themed';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_BASE_URL } from '../config';

/* =======================
   TIPOS
======================= */
type Restaurante = {
  idRestaurante: number;
  nome: string;
  urlImagem: string;
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
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);

  const updateSearch = (text: string) => setSearch(text);

  /* =======================
     BUSCAR RESTAURANTES
  ======================= */
  useEffect(() => {
    async function fetchRestaurantes() {
      try {
        const response = await axios.get<any[]>(
          `${API_BASE_URL}/categorias/restaurantes`
        );

        const listaRestaurantes: Restaurante[] = response.data.flatMap(
          (categoria) =>
            categoria.restaurantes.map((rest: any) => ({
              idRestaurante: rest.idRestaurante,
              nome: rest.nome,
              urlImagem: rest.urlImagem,
              categoria: {
                id: categoria.id,
                nome: categoria.nome,
              },
            }))
        );

        setRestaurantes(listaRestaurantes);
      } catch (error) {
        console.error('Erro ao buscar restaurantes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurantes();
  }, []);

  /* =======================
     FILTRO
  ======================= */
  const restaurantesFiltrados = restaurantes.filter((r) =>
    r.nome.toLowerCase().includes(search.toLowerCase())
  );

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 30) / 2;

  /* =======================
     ITEM
  ======================= */
  const renderItem = ({ item }: { item: Restaurante }) => (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('ProdutosRestaurante', {
          id: item.idRestaurante,
        })
      }
    >
      <ImageBackground
        source={{
          uri: item.urlImagem
            ? `${API_BASE_URL}${item.urlImagem.replace(/\\/g, '/')}`
            : 'https://via.placeholder.com/150',
        }}
        style={styles.imagemFundo}
        imageStyle={{ borderRadius: 8 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.categoria}>{item.categoria.nome}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  /* =======================
     RENDER
  ======================= */
  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="O que vai pedir hoje?"
        onChangeText={updateSearch}
        value={search}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.inputContainer}
      />

      <Text style={styles.titulo}>Restaurantes</Text>

      <FlatList
        data={restaurantesFiltrados}
        renderItem={renderItem}
        keyExtractor={(item) => item.idRestaurante.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          !loading ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Nenhum restaurante encontrado
            </Text>
          ) : null
        }
      />
    </View>
  );
}

/* =======================
   ESTILOS
======================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
  },
  searchContainer: {
    backgroundColor: '#f5f5f5',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 10,
  },
  titulo: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagemFundo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 6,
    alignItems: 'center',
  },
  nome: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  categoria: {
    color: '#fff',
    fontSize: 12,
  },
});
