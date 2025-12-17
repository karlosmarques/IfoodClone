import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { API_BASE_URL } from '../app/config';

/* ========= UTILS ========= */
const onlyNumbers = (value: string) => value.replace(/\D/g, '');

export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [foneCelular, setFoneCelular] = useState('');
  const [dtNascimento, setDtNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');

  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');

  async function cadastrar() {
    const cpfNumeros = onlyNumbers(cpf);
    const foneNumeros = onlyNumbers(foneCelular);

    if (
      !nome || !cpf || !email || !senha || !confirmarSenha ||
      !foneCelular || !dtNascimento || !rua || !numero ||
      !bairro || !cidade || !estado || !cep
    ) {
      return setErro('Preencha todos os campos');
    }

    if (!email.includes('@')) return setErro('Email inválido');
    if (cpfNumeros.length !== 11) return setErro('CPF deve ter 11 dígitos');
    if (foneNumeros.length !== 11) return setErro('Telefone inválido');
    if (senha.length < 6) return setErro('Senha mínima de 6 caracteres');
    if (senha !== confirmarSenha) return setErro('As senhas devem ser iguais');

    setErro('');

    try {
      await axios.post(`${API_BASE_URL}/auth/registro`, {
        nome,
        cpf: cpfNumeros,
        email,
        password: senha,
        dt_nascimento: dtNascimento,
        fone_celular: foneNumeros,
        endereco: {
          rua,
          numero,
          bairro,
          cidade,
          estado,
          cep,
        },
      });

      router.push('/login');
    } catch (e) {
      console.log(e);
      setErro('Erro ao cadastrar usuário');
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.page}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.titulo}>Cadastro</Text>

          {/* ===== DADOS PESSOAIS ===== */}
          <Text style={styles.subtitulo}>Dados pessoais</Text>

          <View style={styles.grid}>
            <View style={[styles.group, styles.full]}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} />
            </View>

            <View style={styles.group}>
              <Text style={styles.label}>CPF</Text>
              <TextInput
                style={styles.input}
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.group}>
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                value={foneCelular}
                onChangeText={setFoneCelular}
                keyboardType="phone-pad"
              />
            </View>

            <View style={[styles.group, styles.full]}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.group}>
              <Text style={styles.label}>Nascimento</Text>
              <TextInput
                style={styles.input}
                placeholder="yyyy-MM-dd"
                value={dtNascimento}
                onChangeText={setDtNascimento}
              />
            </View>

            <View style={[styles.group, styles.full]}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
            </View>

            <View style={[styles.group, styles.full]}>
              <Text style={styles.label}>Repetir senha</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />
            </View>
          </View>

          {/* ===== ENDEREÇO ===== */}
          <Text style={styles.subtitulo}>Endereço</Text>

          <View style={styles.grid}>
            <View style={[styles.group, styles.full]}>
              <Text style={styles.label}>Rua</Text>
              <TextInput style={styles.input} value={rua} onChangeText={setRua} />
            </View>

            <View style={styles.group}>
              <Text style={styles.label}>Número</Text>
              <TextInput style={styles.input} value={numero} onChangeText={setNumero} />
            </View>

            <View style={styles.group}>
              <Text style={styles.label}>CEP</Text>
              <TextInput
                style={styles.input}
                value={cep}
                onChangeText={setCep}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.group, styles.full]}>
              <Text style={styles.label}>Bairro</Text>
              <TextInput style={styles.input} value={bairro} onChangeText={setBairro} />
            </View>

            <View style={[styles.group, styles.full]}>
              <Text style={styles.label}>Cidade</Text>
              <TextInput style={styles.input} value={cidade} onChangeText={setCidade} />
            </View>

            <View style={styles.group}>
              <Text style={styles.label}>Estado</Text>
              <TextInput style={styles.input} value={estado} onChangeText={setEstado} />
            </View>
          </View>

          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          <TouchableOpacity style={styles.btn} onPress={cadastrar}>
            <Text style={styles.btnText}>Cadastrar</Text>
          </TouchableOpacity>

          <Text style={styles.voltar}>
            <Link href="/login">← Voltar ao login</Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ========= STYLES ========= */
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#FFF5F5',
    flexGrow: 1,
    paddingBottom: 100,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    elevation: 5,
  },
  titulo: {
    textAlign: 'center',
    color: '#EA1D2C',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    color: '#222',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  group: {
    width: '48%',
    marginBottom: 16,
  },
  full: {
    width: '100%',
  },
  label: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  erro: {
    backgroundColor: '#FFEAEA',
    color: '#B30000',
    textAlign: 'center',
    padding: 14,
    borderRadius: 12,
    marginVertical: 16,
    fontSize: 14,
  },
  btn: {
    backgroundColor: '#EA1D2C',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  voltar: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
});
