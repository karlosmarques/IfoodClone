import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Input, Text } from '@rneui/themed';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { API_BASE_URL } from '../app/config';
import { useLocalSearchParams } from "expo-router";


export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();


  const handleLogin = async () => {
    setErro('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password: senha,
      });

      const token = response.data.token;
      console.log('Token JWT:', token);

      // Salvar o token no AsyncStorage
      await AsyncStorage.setItem('token', token);

      // Navegar pra tela principal
const target =
  typeof redirect === "string"
    ? redirect
    : Array.isArray(redirect)
    ? redirect[0]
    : "/";

router.replace(target);


    } catch (err: any) {
      console.log(err.response?.data || err.message);
      setErro(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Entrar</Text>

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      <Button
        title="Login"
        loading={loading}
        buttonStyle={styles.button}
        onPress={handleLogin}
      />

      <View style={styles.linksContainer}>
        <Link href="/esqueceuSenha" style={styles.linkSenha}>
          Esqueceu sua senha?
        </Link>

        <Text style={styles.linkText}>
          Ainda não tem conta?{' '}
          <Link href="/cadastro" style={styles.link}>
            Cadastre-se
          </Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#E60014',
    borderRadius: 8,
    paddingVertical: 12,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  linksContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkSenha: {
    color: '#E60014',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  linkText: {
    textAlign: 'center',
  },
  link: {
    color: '#E60014',
    fontWeight: 'bold',
  },
});
