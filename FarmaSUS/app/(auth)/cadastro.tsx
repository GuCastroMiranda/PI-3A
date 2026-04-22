import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, UserType } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function Cadastro() {
  const [type, setType] = useState<UserType>('consumidor');
  
  const [nome, setNome] = useState(''); 
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleCadastro = () => {
    if (nome.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha o seu nome ou do estabelecimento.');
      return;
    }
    if (password === '' || confirmPassword === '') {
      Alert.alert('Erro', 'Por favor, preencha a senha e a confirmação.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem. Tente novamente.');
      return;
    }

    login({
      name: nome,
      type: type,
      cpf: cpf,
      email: email,
      phone: '', 
      cep: cep,
      address: endereco
    } as any); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoSmall}>
            <Ionicons name="location" size={30} color="#1A3C6B" />
          </View>
          <Text style={styles.logoText}>Farma<Text style={styles.logoTextLight}>SUS</Text></Text>
        </View>

        <View style={styles.typeToggle}>
          <TouchableOpacity onPress={() => setType('consumidor')} style={[styles.toggleBtn, type === 'consumidor' && styles.toggleBtnActive]}>
            <Text style={[styles.toggleText, type === 'consumidor' && styles.toggleTextActive]}>Consumidor</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setType('farmacia')} style={[styles.toggleBtn, type === 'farmacia' && styles.toggleBtnActive]}>
            <Text style={[styles.toggleText, type === 'farmacia' && styles.toggleTextActive]}>Farmácia</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Crie sua conta:{"\n"}{type === 'consumidor' ? 'Consumidor' : 'Farmacêutico / Farmácia'}</Text>

        <View style={styles.form}>
          <TextInput style={styles.input} placeholder={type === 'consumidor' ? "Nome Completo" : "Nome do Estabelecimento"} placeholderTextColor="#666" value={nome} onChangeText={setNome} />
          <TextInput style={styles.input} placeholder={type === 'consumidor' ? "CPF" : "CNPJ ou MEI"} placeholderTextColor="#666" keyboardType="numeric" value={cpf} onChangeText={setCpf} />
          <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#666" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="CEP" placeholderTextColor="#666" keyboardType="numeric" value={cep} onChangeText={setCep} />
          <TextInput style={styles.input} placeholder="Endereço Completo" placeholderTextColor="#666" value={endereco} onChangeText={setEndereco} />

          <Text style={styles.sectionLabel}>Segurança</Text>
          <TextInput style={styles.input} placeholder="Crie uma senha" placeholderTextColor="#666" secureTextEntry value={password} onChangeText={setPassword} />
          <TextInput style={styles.input} placeholder="Confirme a senha" placeholderTextColor="#666" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleCadastro}>
          <Text style={styles.submitButtonText}>Finalizar Cadastro</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6F0FA' },
  scrollContent: { padding: 25, paddingBottom: 50 },
  header: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
  logoSmall: { width: 60, height: 60, backgroundColor: '#FFF', borderRadius: 15, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, marginBottom: 10 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#1A3C6B' },
  logoTextLight: { fontWeight: '400', color: '#6A8FB8' },
  typeToggle: { flexDirection: 'row', backgroundColor: '#D9E8F5', borderRadius: 25, padding: 5, marginBottom: 20 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  toggleText: { color: '#6A8FB8', fontWeight: 'bold' },
  toggleTextActive: { color: '#1A3C6B' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 25, lineHeight: 34 },
  form: { marginBottom: 30 },
  sectionLabel: { fontSize: 16, fontWeight: 'bold', color: '#1A3C6B', marginTop: 10, marginBottom: 15 },
  input: { backgroundColor: '#F5F8FC', borderRadius: 20, padding: 18, marginBottom: 15, fontSize: 15, color: '#333', borderWidth: 1, borderColor: '#D9E2EC', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  submitButton: { backgroundColor: '#2F8F8F', borderRadius: 25, padding: 18, alignItems: 'center', shadowColor: '#2F8F8F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  loginText: { color: '#333', fontSize: 14 },
  loginLink: { color: '#1A3C6B', fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline' },
});