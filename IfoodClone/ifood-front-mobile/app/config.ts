import Constants from "expo-constants";
import { Platform } from "react-native";

// Descobre automaticamente o IP da máquina que roda o backend:
// - no navegador (expo web) usa o mesmo host da página (ex: localhost)
// - no celular (Expo Go) usa o IP do computador que está rodando o "expo start"
function descobrirHost() {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return window.location.hostname;
  }

  const hostUri = Constants.expoConfig?.hostUri; // ex: "192.168.101.11:8082"
  if (hostUri) {
    return hostUri.split(":")[0];
  }

  return "localhost";
}

export const API_BASE_URL = `http://${descobrirHost()}:8081`;
