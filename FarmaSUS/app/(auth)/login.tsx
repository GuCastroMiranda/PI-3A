import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    if (name.trim() !== '') {
      // Enviando dados simulados para preencher o Perfil após o login
      login({
        name: "Usuário Logado", 
        type: 'consumidor',
        cpf: name, 
        email: "email@simulado.com",
        phone: "(00) 00000-0000",
        address: "Endereço cadastrado no sistema"
      } as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.logoContainer}>
          {/* Substituímos os ícones pela sua imagem 'icone.png' */}
          <Image 
            source={require('../../assets/images/icone.png')} 
            style={styles.logoImage} 
            resizeMode="contain"
          />
          <Text style={styles.logoText}>Farma<Text style={styles.logoTextLight}>SUS</Text></Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="CPF ou E-mail"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/cadastro')}>
            <Text style={styles.registerLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6F0FA' },
  content: { flex: 1, padding: 25, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 50 },
  
  // Novo estilo para definir o tamanho da sua logo na tela de login
  logoImage: { width: 110, height: 110, marginBottom: 15 },
  
  logoText: { fontSize: 34, fontWeight: 'bold', color: '#1A3C6B' },
  logoTextLight: { fontWeight: '400', color: '#6A8FB8' },
  inputContainer: { marginBottom: 30 },
  input: { backgroundColor: '#FFF', borderRadius: 15, padding: 18, marginBottom: 15, fontSize: 16, color: '#333', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  forgotPassword: { color: '#1A3C6B', fontSize: 14, textAlign: 'right', marginTop: 5, textDecorationLine: 'underline' },
  loginButton: { backgroundColor: '#1A3C6B', borderRadius: 20, padding: 18, alignItems: 'center', shadowColor: '#1A3C6B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  registerText: { color: '#666', fontSize: 15 },
  registerLink: { color: '#1A3C6B', fontSize: 15, fontWeight: 'bold', textDecorationLine: 'underline' },
});