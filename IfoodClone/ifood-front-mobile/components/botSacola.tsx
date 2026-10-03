import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { cores, formatarPreco } from "../constants/ui";
import { useSacola } from "../context/SacolaContext";

export default function SacolaFlutuante() {
  const { itens, total } = useSacola();
  const router = useRouter();

  const quantidade = itens.reduce((soma, i) => soma + i.quantidade, 0);

  // Só aparece quando há algo na sacola
  if (quantidade === 0) return null;

  return (
    <View style={styles.sacolaBar} pointerEvents="box-none">
      <Pressable
        style={({ pressed }) => [styles.sacolaButton, pressed && { opacity: 0.9 }]}
        onPress={() => router.push("/sacola")}
      >
        <View style={styles.icone}>
          <Ionicons name="bag-handle" size={18} color="#fff" />
          <View style={styles.contador}>
            <Text style={styles.contadorTexto}>{quantidade}</Text>
          </View>
        </View>
        <Text style={styles.sacolaText}>Ver sacola</Text>
        <Text style={styles.sacolaTotal}>{formatarPreco(total)}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sacolaBar: {
    position: "absolute",
    bottom: 12,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  sacolaButton: {
    backgroundColor: cores.vermelho,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: cores.vermelho,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  icone: { width: 28 },
  contador: {
    position: "absolute",
    top: -8,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  contadorTexto: { color: cores.vermelho, fontSize: 11, fontWeight: "800" },
  sacolaText: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  sacolaTotal: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
