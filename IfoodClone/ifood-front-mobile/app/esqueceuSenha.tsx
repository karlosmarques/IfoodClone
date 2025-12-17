import { Button, Input, Text } from '@rneui/themed';
import axios from 'axios';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function EsqueceuSenha() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnviar = async () => {
    setErro('');
    setMensagem('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/auth/esqueceusenha', {
        email,
      });

      setMensagem(response.data.message || 'Email de recuperação enviado!');
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      setErro(err.response?.data?.message || 'Erro ao enviar email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Esqueceu sua senha?</Text>
      <Text style={styles.subtitle}>Digite seu email para receber um link de redefinição.</Text>

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {erro ? <Text style={styles.error}>{erro}</Text> : null}
      {mensagem ? <Text style={styles.success}>{mensagem}</Text> : null}

      <Button
        title="Enviar link"
        loading={loading}
        buttonStyle={styles.button}
        onPress={handleEnviar}
      />

      <View style={styles.linksContainer}>
        <Link href="/login" style={styles.link}>
          Voltar para o login
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { textAlign: 'center', marginBottom: 16 },
  subtitle: { textAlign: 'center', marginBottom: 24, color: '#555' },
  button: { backgroundColor: '#E60014', borderRadius: 8, paddingVertical: 12 },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
  success: { color: 'green', textAlign: 'center', marginBottom: 10 },
  linksContainer: { alignItems: 'center', marginTop: 20 },
  link: { color: '#E60014', fontWeight: 'bold' },
});
