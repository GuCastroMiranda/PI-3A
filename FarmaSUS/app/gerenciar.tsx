import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function GerenciarEstoque() {
  const router = useRouter();
  const { token } = useAuth();
  
  const [medications, setMedications] = useState<any[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  
  // Guardará as alterações não salvas (se não tiver no objeto, usamos o valor do banco)
  const [quantities, setQuantities] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);

  // Estados para cadastrar um novo medicamento
  const [newMedName, setNewMedName] = useState('');
  const [newMedCategory, setNewMedCategory] = useState('');
  const [newMedDescription, setNewMedDescription] = useState('');
  const [isAddingMed, setIsAddingMed] = useState(false);

  async function fetchData() {
    try {
      const [medRes, pharmRes] = await Promise.all([
        api.get('/medications'),
        api.get('/pharmacies')
      ]);
      setMedications(medRes.data);
      setPharmacies(pharmRes.data);
      
      if (pharmRes.data.length > 0 && !selectedPharmacy) {
        setSelectedPharmacy(pharmRes.data[0].id);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao carregar dados do servidor.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Quando trocar de farmácia, limpamos os valores digitados não salvos
  useEffect(() => {
    setQuantities({});
  }, [selectedPharmacy]);

  // Função para pegar o valor que deve ser mostrado (digitado ou o atual do banco)
  const getDisplayQty = (medId: string) => {
    if (quantities[medId] !== undefined) {
      return parseInt(quantities[medId], 10) || 0;
    }
    const med = medications.find(m => m.id === medId);
    const inv = med?.inventories?.find((i: any) => i.pharmacy_id === selectedPharmacy);
    return inv ? inv.quantity : 0;
  };

  const handleIncrement = (medId: string) => {
    const current = getDisplayQty(medId);
    setQuantities({ ...quantities, [medId]: String(current + 1) });
  };

  const handleDecrement = (medId: string) => {
    const current = getDisplayQty(medId);
    if (current > 0) {
      setQuantities({ ...quantities, [medId]: String(current - 1) });
    }
  };

  const handleUpdateStock = async (medicationId: string) => {
    if (!selectedPharmacy) {
      Alert.alert('Aviso', 'Selecione uma farmácia primeiro.');
      return;
    }

    const qty = getDisplayQty(medicationId);

    try {
      await api.post('/inventory', {
        pharmacy_id: selectedPharmacy,
        medication_id: medicationId,
        quantity: qty
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Alert.alert('Sucesso', 'Estoque atualizado com sucesso!');
      
      // Limpa a alteração local para forçar a ler do banco de novo
      const newQuantities = { ...quantities };
      delete newQuantities[medicationId];
      setQuantities(newQuantities);
      
      fetchData(); // Recarrega para atualizar a lista
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao atualizar estoque. Verifique suas permissões.');
    }
  };

  const handleAddMedication = async () => {
    if (newMedName.trim() === '') {
      Alert.alert('Aviso', 'O nome do medicamento é obrigatório.');
      return;
    }

    try {
      await api.post('/medications', {
        name: newMedName,
        category: newMedCategory || 'Geral',
        description: newMedDescription || undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Sucesso', 'Novo medicamento registrado no sistema!');
      setNewMedName('');
      setNewMedCategory('');
      setNewMedDescription('');
      setIsAddingMed(false);
      fetchData();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao registrar medicamento.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1A3C6B" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A3C6B" />
        </TouchableOpacity>
        <Text style={styles.title}>Gerenciar Estoque</Text>
      </View>

      <FlatList
        style={styles.content}
        data={medications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <>
            <Text style={styles.label}>1. Selecione a Unidade (UBS):</Text>
            <FlatList
              horizontal
              data={pharmacies}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              style={styles.pharmacyList}
              renderItem={({ item }) => {
                const isSelected = selectedPharmacy === item.id;
                return (
                  <TouchableOpacity 
                    style={[styles.pharmacyButton, isSelected && styles.pharmacyButtonSelected]}
                    onPress={() => setSelectedPharmacy(item.id)}
                  >
                    <Text style={[styles.pharmacyText, isSelected && styles.pharmacyTextSelected]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

            <View style={styles.headerRow}>
              <Text style={styles.label}>2. Estoque por Medicamento:</Text>
              <TouchableOpacity onPress={() => setIsAddingMed(!isAddingMed)} style={styles.addMedIcon}>
                <Ionicons name={isAddingMed ? "close-circle" : "add-circle"} size={28} color="#2F8F8F" />
              </TouchableOpacity>
            </View>

            {isAddingMed && (
              <View style={styles.addMedContainer}>
                <Text style={styles.addMedTitle}>Registrar Novo Medicamento</Text>
                <TextInput
                  style={styles.addMedInput}
                  placeholder="Nome do Medicamento (ex: Dipirona 500mg)"
                  value={newMedName}
                  onChangeText={setNewMedName}
                />
                <TextInput
                  style={styles.addMedInput}
                  placeholder="Categoria (ex: Analgésico)"
                  value={newMedCategory}
                  onChangeText={setNewMedCategory}
                />
                <TextInput
                  style={styles.addMedInput}
                  placeholder="Descrição ou Indicações (opcional)"
                  value={newMedDescription}
                  onChangeText={setNewMedDescription}
                  multiline
                />
                <TouchableOpacity style={styles.addMedButton} onPress={handleAddMedication}>
                  <Text style={styles.addMedButtonText}>Salvar Medicamento</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => {
          const currentQty = getDisplayQty(item.id);
          // Verifica se houve alteração em relação ao banco para destacar o botão
          const medInv = item.inventories?.find((i: any) => i.pharmacy_id === selectedPharmacy);
          const dbQty = medInv ? medInv.quantity : 0;
          const isChanged = currentQty !== dbQty;

          return (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.medName}>{item.name}</Text>
                <Text style={styles.medCategory}>{item.category || 'Geral'}</Text>
              </View>
              
              <View style={styles.actionRow}>
                <View style={styles.stepperContainer}>
                  <TouchableOpacity style={styles.stepperButton} onPress={() => handleDecrement(item.id)}>
                    <Ionicons name="remove" size={20} color="#1A3C6B" />
                  </TouchableOpacity>
                  
                  <TextInput
                    style={styles.stepperInput}
                    keyboardType="numeric"
                    value={String(currentQty)}
                    onChangeText={(text) => setQuantities({ ...quantities, [item.id]: text })}
                  />
                  
                  <TouchableOpacity style={styles.stepperButton} onPress={() => handleIncrement(item.id)}>
                    <Ionicons name="add" size={20} color="#1A3C6B" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={[styles.updateButton, isChanged ? styles.updateButtonActive : styles.updateButtonInactive]} 
                  onPress={() => handleUpdateStock(item.id)}
                  disabled={!isChanged}
                >
                  <Text style={[styles.updateButtonText, !isChanged && styles.updateButtonTextInactive]}>
                    Salvar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6F0FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 40, backgroundColor: '#FFF', elevation: 2 },
  backButton: { marginRight: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A3C6B' },
  content: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#1A3C6B', marginBottom: 10, marginTop: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  addMedIcon: { padding: 5 },
  addMedContainer: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: '#D9E2EC', borderStyle: 'dashed' },
  addMedTitle: { fontSize: 16, fontWeight: 'bold', color: '#2F8F8F', marginBottom: 10 },
  addMedInput: { backgroundColor: '#F0F4F8', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#D9E2EC' },
  addMedButton: { backgroundColor: '#2F8F8F', padding: 15, borderRadius: 10, alignItems: 'center' },
  addMedButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  pharmacyList: { maxHeight: 60, flexGrow: 0, marginBottom: 10 },
  pharmacyButton: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#D9E2EC', height: 40, justifyContent: 'center' },
  pharmacyButtonSelected: { backgroundColor: '#1A3C6B', borderColor: '#1A3C6B' },
  pharmacyText: { color: '#555', fontWeight: '500' },
  pharmacyTextSelected: { color: '#FFF', fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardInfo: { marginBottom: 10 },
  medName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  medCategory: { fontSize: 13, color: '#888' },
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4F8', borderRadius: 10, borderWidth: 1, borderColor: '#D9E2EC' },
  stepperButton: { padding: 10 },
  stepperInput: { width: 50, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#1A3C6B' },
  updateButton: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  updateButtonActive: { backgroundColor: '#1A3C6B' },
  updateButtonInactive: { backgroundColor: '#E0E0E0' },
  updateButtonText: { color: '#FFF', fontWeight: 'bold' },
  updateButtonTextInactive: { color: '#999' }
});