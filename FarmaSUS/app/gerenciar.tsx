import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function GerenciarEstoque() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A3C6B" />
        </TouchableOpacity>
        <Text style={styles.title}>Gerenciar Estoque</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.textoProvisorio}>
          Aqui vai ficar a tela para a farmácia adicionar, editar e remover medicamentos!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6F0FA' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 40, backgroundColor: '#FFF', elevation: 2 },
  backButton: { marginRight: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A3C6B' },
  content: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  textoProvisorio: { fontSize: 16, color: '#666', textAlign: 'center' }
});