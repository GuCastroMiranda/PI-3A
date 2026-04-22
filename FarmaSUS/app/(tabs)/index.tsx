import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, SafeAreaView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { medicationsMock } from '../../data/mock';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  // Puxamos também os favoritos e a função de alternar
  const { user, favorites, toggleFavorite } = useAuth();
  const [search, setSearch] = useState('');

  const filteredMedications = medicationsMock.filter(med =>
    med.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.name || 'Visitante'}!</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#1A3C6B" />
          <Text style={styles.locationText}>Brasília, DF</Text>
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar medicamentos..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        style={styles.container}
        data={filteredMedications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isFav = favorites.includes(item.id); // Verifica se já é favorito
          return (
            <View style={styles.card}>
              {/* Cabeçalho do cartão com Nome e Coração */}
              <View style={styles.cardHeader}>
                <Text style={styles.medName}>{item.name}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                  <Ionicons name={isFav ? "heart" : "heart-outline"} size={28} color={isFav ? "#D32F2F" : "#A0B4C8"} />
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
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E6F0FA', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 20, marginBottom: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#1A3C6B' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  locationText: { fontSize: 14, color: '#1A3C6B', marginLeft: 4, fontWeight: '500' },
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
});