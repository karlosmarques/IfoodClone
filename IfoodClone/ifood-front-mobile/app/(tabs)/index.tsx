import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from '@rneui/themed';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const API_BASE_URL = "http://192.168.101.12:8081";

type Loja = {
  idRestaurante: number;
  nome: string;
  urlImagem: string;
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

  // Função para lidar com a seleção da categoria
  const handleCategoriaClick = (categoriaId: number) => {
    // Se a categoria já foi selecionada, reseta o filtro
    if (categoriaId === categoriaSelecionada) {
      setCategoriaSelecionada(null); // Mostrar todas as lojas
    } else {
      setCategoriaSelecionada(categoriaId); // Filtrar por categoria
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* BANNERS */}
      <View style={styles.promoSection}>
        <Text style={styles.titulo}>Sabores para todos os gostos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promoScroll}
        >
          <View style={styles.promoCard}>
            <Image
              style={styles.promoImage}
              resizeMode="cover"
              source={{
                uri: 'https://raw.githubusercontent.com/ViniciusX22/onebitfood/master/public/images/categories/japonese.jpeg',
              }}
            />
          </View>
          <View style={styles.promoCard}>
            <Image
              style={styles.promoImage}
              resizeMode="cover"
              source={{
                uri: 'https://raw.githubusercontent.com/ViniciusX22/onebitfood/master/public/images/categories/arabic.jpg',
              }}
            />
          </View>
          <View style={styles.promoCard}>
            <Image
              style={styles.promoImage}
              resizeMode="cover"
              source={{
                uri: 'https://raw.githubusercontent.com/ViniciusX22/onebitfood/master/public/images/categories/vegan.jpeg',
              }}
            />
          </View>
          <View style={styles.promoCard}>
            <Image
              style={styles.promoImage}
              resizeMode="cover"
              source={{
                uri: 'https://raw.githubusercontent.com/ViniciusX22/onebitfood/master/public/images/categories/italian.jpeg',
              }}
            />
          </View>
          <View style={styles.promoCard}>
            <Image
              style={styles.promoImage}
              resizeMode="cover"
              source={{
                uri: 'https://raw.githubusercontent.com/ViniciusX22/onebitfood/master/public/images/categories/mexican.jpg',
              }}
            />
          </View>
        </ScrollView>
      </View>

      {/* CATEGORIAS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categorias.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.categoryCard}
              onPress={() => handleCategoriaClick(c.id)}
            >
              <View style={styles.categoryImageContainer}>
                <Image
                  source={{
                    uri: c.urlImagem
                      ? `${API_BASE_URL}${c.urlImagem.replace(/\\/g, "/")}`
                      : "https://via.placeholder.com/100"
                  }}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.categoryName}>{c.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* LOJAS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Restaurantes</Text>

        {lojasFiltradas.map((l) => (
          <TouchableOpacity
            key={l.idRestaurante}
            style={styles.restaurantCard}
            onPress={() =>
              navigation.navigate("ProdutosRestaurante", {
                id: l.idRestaurante,
              })
            }
            activeOpacity={0.7}
          >
            <Image
              style={styles.restaurantImage}
              resizeMode="cover"
              source={{
                uri: l.urlImagem
                  ? `${API_BASE_URL}${l.urlImagem.replace(/\\/g, "/")}`
                  : "https://via.placeholder.com/100"
              }}
            />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{l.nome}</Text>
              <Text style={styles.restaurantDetails}>
                ⭐ 4.5 • 30-40 min • R$ 10,00
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

// (mantém seu StyleSheet exatamente igual)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E2E2E',
    marginBottom: 16,
  },
  promoSection: {
    marginTop: 16,
    paddingLeft: 16,
  },
  titulo: {
    fontSize: 21,
    fontWeight: '700',
    color: '#000000ff',
    marginHorizontal: 16,
    marginBottom: 12,
    textAlign: 'center'
  },
  promoScroll: {
    paddingRight: 16,
  },
  promoCard: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  promoImage: {
    width: 320,
    height: 160,
    backgroundColor: '#E0E0E0',
  },
  categoriesScroll: {
    paddingRight: 16,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E2E2E',
    textAlign: 'center',
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E2E2E',
    marginBottom: 6,
  },
  restaurantDetails: {
    fontSize: 13,
    color: '#717171',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 24,
  },
});
