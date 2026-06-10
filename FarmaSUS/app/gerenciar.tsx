import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, TextInput, Alert, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function GerenciarEstoque() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  
  const [medications, setMedications] = useState<any[]>([]);
  
  const [quantities, setQuantities] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);

  // Estados para cadastrar um novo medicamento
  const [newMedName, setNewMedName] = useState('');
  const [newMedCategory, setNewMedCategory] = useState('');
  const [newMedDescription, setNewMedDescription] = useState('');
  const [newMedBarcode, setNewMedBarcode] = useState('');
  const [isAddingMed, setIsAddingMed] = useState(false);

  // Estados da câmera
  const [isScanning, setIsScanning] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);

  async function fetchData() {
    try {
      const medRes = await api.get('/medications');
      setMedications(medRes.data);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Falha ao carregar dados do servidor.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setQuantities({});
  }, [user?.pharmacy_id]);

  const getDisplayQty = (medId: string) => {
    if (quantities[medId] !== undefined) {
      return parseInt(quantities[medId], 10) || 0;
    }
    const med = medications.find(m => m.id === medId);
    const inv = med?.inventories?.find((i: any) => i.pharmacy_id === user?.pharmacy_id);
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
    if (!user?.pharmacy_id) {
      Alert.alert('Aviso', 'Sua conta não está vinculada a nenhuma farmácia. Entre em contato com o suporte.');
      return;
    }

    const qty = getDisplayQty(medicationId);

    try {
      await api.post('/inventory', {
        pharmacy_id: user.pharmacy_id,
        medication_id: medicationId,
        quantity: qty
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Alert.alert('Sucesso', 'Estoque atualizado com sucesso!');
      
      const newQuantities = { ...quantities };
      delete newQuantities[medicationId];
      setQuantities(newQuantities);
      
      fetchData();
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Falha ao atualizar estoque. Verifique suas permissões.');
    }
  };

  const abrirCamera = async () => {
    if (!permission?.granted) {
      const response = await requestPermission();
      if (!response.granted) {
        Alert.alert('Aviso', 'Precisamos da permissão da câmera para ler o código!');
        return;
      }
    }
    setIsScanning(true);
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setIsScanning(false);
    setNewMedBarcode(data);
    setIsConsulting(true);

    try {
      const response = await fetch(`https://api.cosmos.bluesoft.com.br/gtins/${data}.json`, {
        method: 'GET',
        headers: {
          'X-Cosmos-Token': '-42olQPGNznH7pn9eSCYQw',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Produto não encontrado');
      }

      const produto = await response.json();
      setNewMedName(produto.description || '');
      setNewMedCategory('Geral');
      setIsAddingMed(true);
      Alert.alert('Sucesso!', 'Produto localizado na base nacional!');
    } catch (erro) {
      setIsAddingMed(true);
      Alert.alert('Aviso', 'Produto não encontrado na base nacional. Preencha manualmente.');
    } finally {
      setIsConsulting(false);
    }
  };

  const handleAddMedication = async () => {
    if (newMedName.trim() === '') {
      Alert.alert('Aviso', 'O nome do medicamento é obrigatório.');
      return;
    }

    try {
      // Opcional: Aqui poderíamos enviar o código de barras se a API suportasse
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
      setNewMedBarcode('');
      setIsAddingMed(false);
      fetchData();
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Falha ao registrar medicamento.');
    }
  };

  if (isScanning) {
    return (
      <SafeAreaView style={styles.cameraContainer}>
        <CameraView 
          style={styles.camera} 
          facing="back"
          barcodeScannerSettings={{ 
            barcodeTypes: [
              "ean13", "ean8", "upc_a", "upc_e", "qr", 
              "code128", "code39", "datamatrix", "itf14", "codabar", "pdf417"
            ] 
          }}
          onBarcodeScanned={handleBarCodeScanned}
        >
          <View style={styles.cameraOverlay}>
            <Text style={styles.cameraText}>Aponte para o código de barras da caixa</Text>
            <View style={styles.scanTarget} />
            <TouchableOpacity style={styles.closeCameraButton} onPress={() => setIsScanning(false)}>
              <Text style={styles.closeCameraText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

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
          <Ionicons name="arrow-back" size={26} color="#1A3C6B" />
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
            <TouchableOpacity style={styles.scanButton} onPress={abrirCamera}>
              <Ionicons name="barcode-outline" size={32} color="#FFF" />
              <Text style={styles.scanButtonText}>Escanear Código de Barras (Cosmos)</Text>
            </TouchableOpacity>

            <View style={styles.headerRow}>
              <Text style={styles.label}>1. Estoque por Medicamento:</Text>
              <TouchableOpacity onPress={() => setIsAddingMed(!isAddingMed)} style={styles.addMedIcon}>
                <Ionicons name={isAddingMed ? "close-circle" : "add-circle"} size={28} color="#2F8F8F" />
              </TouchableOpacity>
            </View>

            {isConsulting && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1A3C6B" />
                <Text style={styles.loadingText}>Consultando Base Nacional...</Text>
              </View>
            )}

            {isAddingMed && !isConsulting && (
              <View style={styles.addMedContainer}>
                <Text style={styles.addMedTitle}>Registrar Novo Medicamento</Text>
                
                {newMedBarcode ? (
                  <Text style={styles.barcodeText}>EAN Escaneado: {newMedBarcode}</Text>
                ) : null}

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
                  <Text style={styles.addMedButtonText}>Salvar Medicamento no Banco</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => {
          const currentQty = getDisplayQty(item.id);
          const medInv = item.inventories?.find((i: any) => i.pharmacy_id === user?.pharmacy_id);
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
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40, backgroundColor: '#FFF', elevation: 2 },
  backButton: { marginRight: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A3C6B' },
  content: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#1A3C6B', marginBottom: 10, marginTop: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  addMedIcon: { padding: 5 },
  addMedContainer: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: '#D9E2EC', borderStyle: 'dashed' },
  addMedTitle: { fontSize: 16, fontWeight: 'bold', color: '#2F8F8F', marginBottom: 10 },
  barcodeText: { fontSize: 14, color: '#666', marginBottom: 10, fontStyle: 'italic' },
  addMedInput: { backgroundColor: '#F0F4F8', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#D9E2EC' },
  addMedButton: { backgroundColor: '#2F8F8F', padding: 15, borderRadius: 10, alignItems: 'center' },
  addMedButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  pharmacyList: { maxHeight: 60, flexGrow: 0, marginBottom: 10 },
  pharmacyButton: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#D9E2EC', height: 40, justifyContent: 'center' },
  pharmacyButtonSelected: { backgroundColor: '#1A3C6B', borderColor: '#1A3C6B' },
  pharmacyText: { color: '#555', fontWeight: '500' },
  pharmacyTextSelected: { color: '#FFF', fontWeight: 'bold' },
  scanButton: { flexDirection: 'row', backgroundColor: '#1A3C6B', borderRadius: 15, padding: 15, alignItems: 'center', justifyContent: 'center', marginTop: 15, marginBottom: 10, shadowColor: '#1A3C6B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  scanButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
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
  updateButtonTextInactive: { color: '#999' },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  cameraOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  scanTarget: { width: 260, height: 160, borderWidth: 2, borderColor: '#00FF00', borderRadius: 12, backgroundColor: 'transparent', marginVertical: 30 },
  cameraText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center', paddingHorizontal: 20 },
  closeCameraButton: { backgroundColor: '#D32F2F', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 20, marginTop: 30 },
  closeCameraText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  loadingContainer: { padding: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderRadius: 15, marginVertical: 15, borderWidth: 1, borderColor: '#D9E2EC' },
  loadingText: { marginTop: 15, fontSize: 16, color: '#1A3C6B', fontWeight: 'bold' }
});