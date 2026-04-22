import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, SafeAreaView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { medicationsMock } from '../../data/mock';
import { Ionicons } from '@expo/vector-icons';

export default function Favoritos() {
  const { favorites, toggleFavorite } = useAuth();
  const [search, setSearch] = useState('');
  
  const favoritosBase = medicationsMock.filter(med => favorites.includes(med.id));

  const filteredFavoritos = favoritosBase.filter(med =>
    med.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Meus Favoritos</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar nos favoritos..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          data={filteredFavoritos}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.medName}>{item.name}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                  <Ionicons name="heart" size={28} color="#D32F2F" />
                </TouchableOpacity>
              </View>
              <Text style={styles.medPharmacy}>{item.pharmacy}</Text>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Status: </Text>
                <Text style={[styles.statusText, { color: item.inStock ? '#00B36B' : '#D32F2F' }]}>
                  {item.inStock ? 'Em estoque' : 'Sem estoque'}
                </Text>
              </View>
              <Text style={styles.address}>Endereço: EQS 415/416</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-dislike-outline" size={60} color="#A0B4C8" />
              <Text style={styles.emptyText}>Você ainda não favoritou{"\n"}nenhum medicamento.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E6F0FA', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1A3C6B', marginTop: 20, marginBottom: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 15, paddingHorizontal: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#333' },
  listContent: { paddingBottom: 120 },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  medName: { fontSize: 18, fontWeight: 'bold', color: '#000', flex: 1 },
  medPharmacy: { fontSize: 14, color: '#888', marginBottom: 15 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  statusLabel: { fontSize: 13, color: '#555' },
  statusText: { fontSize: 13, fontWeight: 'bold' },
  address: { fontSize: 13, color: '#555' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 15, fontSize: 16, lineHeight: 24 },
});