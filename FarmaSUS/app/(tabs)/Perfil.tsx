import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, TextInput, Platform, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function Perfil() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  useEffect(() => {
    if (user) {
      setNome(user.name || '');
      setCpf(user.cpf || '');
      setEmail(user.email || '');
      setTelefone(user.phone || '');
      setEndereco(user.address || '');
    }
  }, [user]);

  const handleSalvar = () => {
    updateUser({
      name: nome,
      email: email,
      phone: telefone,
      address: endereco
    });
    Alert.alert("Sucesso", "Suas informações foram atualizadas!");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={50} color="#7A9CBB" />
          </View>
          <View style={styles.profileInfoText}>
            {/* O nome aqui em cima também atualiza automaticamente */}
            <Text style={styles.name}>{user?.name || 'Guilherme'}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color="#1A3C6B" />
              <Text style={styles.locationText}>Brasília, DF</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Informações de Perfil</Text>
        
        <View style={styles.formGroup}>
          {/* Trocamos 'value' por 'placeholder' para os textos sumirem quando você digitar, e conectamos as variáveis */}
          <TextInput style={styles.input} placeholder="Nome Completo" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
          
          <TextInput style={[styles.input, styles.inputDisabled]} placeholder="CPF/CNPJ (apenas leitura)" placeholderTextColor="#888" value={cpf} editable={false} />
          
          <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#888" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          
          <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor="#888" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
          
          <TextInput style={styles.input} placeholder="Endereço Completo" placeholderTextColor="#888" value={endereco} onChangeText={setEndereco} />
        </View>

        <Text style={styles.sectionTitle}>Segurança</Text>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Alterar Senha</Text>
        </TouchableOpacity>

        {user?.type === 'farmacia' && (
          <>
            <Text style={styles.sectionTitle}>Gerenciamento da Farmácia</Text>
            {/* Adicionamos a navegação aqui */}
            <TouchableOpacity style={styles.manageButton} onPress={() => router.push('/gerenciar')}>
              <Text style={styles.manageButtonText}>Gerenciar Estoque e Medicamentos</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Adicionamos a função de salvar aqui */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E6F0FA', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { padding: 25, paddingBottom: 40 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#D9E8F5', justifyContent: 'center', alignItems: 'center', marginRight: 20 },
  profileInfoText: { justifyContent: 'center' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1A3C6B', marginBottom: 5 },
  locationContainer: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 14, color: '#1A3C6B', marginLeft: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 15, marginTop: 10 },
  formGroup: { marginBottom: 10 },
  input: { backgroundColor: '#F0F4F8', borderRadius: 20, padding: 15, marginBottom: 15, fontSize: 15, color: '#555', borderWidth: 1, borderColor: '#D9E2EC' },
  inputDisabled: { backgroundColor: '#E8ECF1', color: '#888' },
  linkButton: { marginBottom: 20 },
  linkText: { color: '#1A3C6B', fontSize: 15, textDecorationLine: 'underline', fontWeight: '500' },
  manageButton: { backgroundColor: '#2F8F8F', borderRadius: 25, padding: 18, alignItems: 'center', marginBottom: 25, shadowColor: '#2F8F8F', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 4 },
  manageButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  saveButton: { backgroundColor: '#1A3C6B', borderRadius: 25, padding: 18, alignItems: 'center', marginTop: 10, shadowColor: '#1A3C6B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  logoutButton: { marginTop: 20, alignItems: 'center', padding: 10 },
  logoutButtonText: { color: '#D32F2F', fontSize: 16, fontWeight: 'bold' },
});