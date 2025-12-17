import React from "react";
import { View, Text, TouchableOpacity, StyleSheet , Pressable} from "react-native";
import { useSacola } from "../context/SacolaContext";
import { useRouter } from "expo-router";

export default function SacolaFlutuante() {
  const { itens, total } = useSacola();
  const router = useRouter();

 

  return (
<View key={total} style={styles.sacolaBar}>
<Pressable
  style={styles.sacolaButton}
  onPress={() => router.push("/sacola")}
>
  <Text style={styles.sacolaText}>Sacola</Text>
  <Text style={styles.sacolaTotal}>R$ {total.toFixed(2)}</Text>
</Pressable>
</View>
  );
}

const styles = StyleSheet.create({
  sacolaBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "#F8F8F8",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    zIndex: 100,
  },
  sacolaButton: {
    backgroundColor: "#EA1D2C",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sacolaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  sacolaTotal: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
