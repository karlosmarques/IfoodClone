import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../app/config';
import { cores, sombra } from '../constants/ui';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [foco, setFoco] = useState<'email' | 'senha' | null>(null);
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();

  const handleLogin = async () => {
    setErro('');

    if (!email.trim() || !senha) {
      setErro('Preencha e-mail e senha');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: email.trim(),
        password: senha,
      });

      // Salvar o token no AsyncStorage
      await AsyncStorage.setItem('token', response.data.token);

      // Volta para onde o usuário estava (ex: sacola) ou para a Home
      const target =
        typeof redirect === 'string'
          ? redirect
          : Array.isArray(redirect)
          ? redirect[0]
          : '/';

      router.replace(target as any);
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      const status = err.response?.status;
      if (!err.response) {
        setErro('Não foi possível conectar ao servidor');
      } else if (status === 401 || status === 403 || status === 500) {
        // O backend responde com erro genérico para usuário/senha inválidos
        setErro('E-mail ou senha incorretos');
      } else {
        setErro(err.response?.data?.message || 'Erro ao fazer login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* TOPO VERMELHO */}
      <SafeAreaView edges={['top']} style={styles.hero}>
        <TouchableOpacity
          style={styles.voltar}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.logo}>iFood</Text>
        <Text style={styles.slogan}>Sua comida favorita,{'\n'}a um toque de distância.</Text>

        <View style={styles.bolha1} />
        <View style={styles.bolha2} />
      </SafeAreaView>

      {/* FORMULÁRIO */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.sheet}
          contentContainerStyle={styles.sheetContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.titulo}>Entrar</Text>
          <Text style={styles.subtitulo}>Acesse sua conta para fazer pedidos</Text>

          <Text style={styles.label}>E-mail</Text>
          <View style={[styles.input, foco === 'email' && styles.inputFoco]}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={foco === 'email' ? cores.vermelho : cores.textoSuave}
            />
            <TextInput
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="#A8A8B0"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="next"
              onFocus={() => setFoco('email')}
              onBlur={() => setFoco(null)}
              style={styles.inputTexto}
            />
          </View>

          <Text style={styles.label}>Senha</Text>
          <View style={[styles.input, foco === 'senha' && styles.inputFoco]}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={foco === 'senha' ? cores.vermelho : cores.textoSuave}
            />
            <TextInput
              placeholder="Sua senha"
              placeholderTextColor="#A8A8B0"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
              autoComplete="password"
              returnKeyType="go"
              onSubmitEditing={handleLogin}
              onFocus={() => setFoco('senha')}
              onBlur={() => setFoco(null)}
              style={styles.inputTexto}
            />
            <TouchableOpacity onPress={() => setMostrarSenha((m) => !m)} hitSlop={10}>
              <Ionicons
                name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={cores.textoSuave}
              />
            </TouchableOpacity>
          </View>

          <Link href="/esqueceuSenha" style={styles.esqueceu}>
            Esqueceu sua senha?
          </Link>

          {erro ? (
            <View style={styles.erro}>
              <Ionicons name="alert-circle" size={18} color={cores.vermelhoEscuro} />
              <Text style={styles.erroTexto}>{erro}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.botao, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divisor}>
            <View style={styles.linha} />
            <Text style={styles.divisorTexto}>ou</Text>
            <View style={styles.linha} />
          </View>

          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={() => router.push('/cadastro')}
            activeOpacity={0.85}
          >
            <Text style={styles.botaoSecundarioTexto}>Criar uma conta</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/')} style={styles.explorar}>
            <Text style={styles.explorarTexto}>Explorar lojas sem entrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.vermelho },

  /* TOPO */
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    overflow: 'hidden',
  },
  voltar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  logo: {
    fontSize: 44,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1.5,
    fontStyle: 'italic',
  },
  slogan: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.92,
    marginTop: 6,
    lineHeight: 25,
    fontWeight: '500',
  },
  bolha1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.08)',
    right: -60,
    top: -40,
  },
  bolha2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    right: 60,
    bottom: -30,
  },

  /* FOLHA BRANCA */
  sheet: {
    flex: 1,
    backgroundColor: cores.superficie,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
  },
  sheetContent: { padding: 24, paddingTop: 28, paddingBottom: 40 },
  titulo: { fontSize: 26, fontWeight: '800', color: cores.texto },
  subtitulo: { fontSize: 15, color: cores.textoSuave, marginTop: 4, marginBottom: 24 },

  label: { fontSize: 13, fontWeight: '700', color: cores.texto, marginBottom: 6 },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.fundo,
    marginBottom: 16,
  },
  inputFoco: { borderColor: cores.vermelho, backgroundColor: cores.superficie },
  inputTexto: { flex: 1, fontSize: 16, color: cores.texto, height: '100%' },

  esqueceu: {
    alignSelf: 'flex-end',
    color: cores.vermelho,
    fontWeight: '700',
    fontSize: 14,
    marginTop: -4,
    marginBottom: 20,
  },

  erro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFECEE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  erroTexto: { color: cores.vermelhoEscuro, fontWeight: '600', flex: 1 },

  botao: {
    height: 54,
    borderRadius: 14,
    backgroundColor: cores.vermelho,
    alignItems: 'center',
    justifyContent: 'center',
    ...sombra,
    shadowColor: cores.vermelho,
    shadowOpacity: 0.3,
  },
  botaoTexto: { color: '#fff', fontSize: 17, fontWeight: '800' },

  divisor: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  linha: { flex: 1, height: 1, backgroundColor: cores.borda },
  divisorTexto: { color: cores.textoSuave, fontSize: 13 },

  botaoSecundario: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoSecundarioTexto: { color: cores.texto, fontSize: 16, fontWeight: '700' },

  explorar: { alignItems: 'center', marginTop: 20 },
  explorarTexto: { color: cores.textoSuave, fontSize: 14, fontWeight: '600' },
});
