import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "@rneui/themed";
import axios from "axios";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { API_BASE_URL } from "../config";

type Pedido = {
  id: number;
  valorTotal: number;
  dataCriacao: string;
  status: string;
  cliente: {
    idUsuario: number;
    email: string;
    nome: string;
    cpf: string;
  };
  restaurante: {
    idRestaurante: number;
    nome: string;
    telefone: string;
    cnpj: string;
    raio_entrega: string;
    categoria: {
      id: number;
      nome: string;
    };
  };
  itens: {
    id: number;
    quantidade: number;
    subtotal: number;
    produto: {
      idProduto: number;
      nome: string;
      descricao: string;
      preco: number;
      ativo: boolean;
    };
  }[];
};

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const token = await AsyncStorage.getItem("token");

        const response = await axios.get(
          `${API_BASE_URL}/pedidos/historico/cliente`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPedidos(response.data);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPedidos();
  }, []);

  return (
    <View style={styles.container}>
      {/* Cabeçalho fixo */}
      <View style={styles.cabecalho}>
        <Text style={styles.cabecalhoTitulo}>Histórico de pedidos</Text>
      </View>

      {/* Conteúdo rolável */}
      <ScrollView
        style={{ flex: 1 }}                 // 👈 ESSENCIAL PARA O SCROLL
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#ff4d4d"
            style={{ marginTop: 24 }}
          />
        ) : pedidos.length === 0 ? (
          <View style={styles.containertext}>
            <Text style={styles.nenhum}>
              Poxa, você não tem nenhum pedido {"\n"}
            </Text>
            <Text style={styles.nenhumsub}>
              Seus pedidos vão aparecer aqui quando você fizer.
              Que tal aproveitar as ofertas pra pedir agora? {"\n"}{"\n"}
            </Text>
            <Link href="/">
              <Text style={styles.nenhumlink}>Fazer pedido</Text>
            </Link>
          </View>
        ) : (
          pedidos.map((item) => (
            <Card key={item.id} containerStyle={styles.card}>
              <Text style={styles.cardTitulo}>
                Restaurante: {item.restaurante.nome}
              </Text>

              <Text style={styles.cardDesc}>
                Total: R$ {item.valorTotal.toFixed(2)}
              </Text>

              <Text style={styles.cardDesc}>
                Status: {item.status}
              </Text>

              <Text style={styles.cardDesc}>
                Data: {new Date(item.dataCriacao).toLocaleString()}
              </Text>

              <Text style={[styles.cardTitulo, { marginTop: 10 }]}>
                Itens:
              </Text>

              {item.itens.map((i) => (
                <View key={i.id} style={{ marginBottom: 6 }}>
                  <Text style={styles.cardDesc}>
                    • {i.quantidade}x {i.produto.nome} — R$ {i.subtotal.toFixed(2)}
                  </Text>
                </View>
              ))}
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5ff",
  },
  cabecalho: {
    height: 120,
    backgroundColor: "#d91f26",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "flex-end",
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 5,
  },
  cabecalhoTitulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  containertext: {
    justifyContent: "center",
    paddingHorizontal: 16,
    marginTop: 120,
  },
  nenhum: {
    color: "#000",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  nenhumsub: {
    textAlign: "center",
    color: "#6e6d6dff",
    marginTop: 8,
  },
  nenhumlink: {
    textAlign: "center",
    color: "#ff0000ff",
    fontWeight: "700",
    marginTop: 12,
  },
  card: {
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    elevation: 3,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    color: "#333",
  },
  cardDesc: {
    fontSize: 14,
    color: "#666",
  },
});
