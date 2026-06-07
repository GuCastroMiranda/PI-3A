import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Alert, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface ItemEstoque {
  id: string;
  codigo: string;
  nome: string;
  dosagem: string;
  formato: string;
  quantidade: number;
  validade: string;
}

export default function GerenciarEstoque() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [estoque, setEstoque] = useState<ItemEstoque[]>([
    { id: '1', codigo: '7891234567890', nome: 'Dipirona Monoidratada', dosagem: '1 g', formato: 'Comprimido', quantidade: 8, validade: '12/2026' },
    { id: '2', codigo: '7899876543210', nome: 'Paracetamol', dosagem: '500 mg', formato: 'Comprimido', quantidade: 3, validade: '08/2027' },
  ]);

  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [formato, setFormato] = useState('');
  const [quantidade, setQuantidade] = useState(0);
  const [validade, setValidade] = useState('');

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
    setCodigo(data);
    setIsLoading(true);

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
      setNome(produto.description || ''); 
      setQuantidade(1); 
      Alert.alert('Sucesso!', 'Produto localizado na base nacional!');
    } catch (erro) {
      Alert.alert('Aviso', 'Produto não encontrado na base de dados. Preencha o nome manualmente.');
      setNome('');
    } finally {
      setIsLoading(false);
    }
  };

  const aumentarQtdForm = () => setQuantidade(quantidade + 1);
  const diminuirQtdForm = () => { if (quantidade > 0) setQuantidade(quantidade - 1); };

  const alterarQuantidadeItemLista = (id: string, operacao: 'somar' | 'subtrair') => {
    setEstoque(prevEstoque =>
      prevEstoque.map(item => {
        if (item.id === id) {
          const novaQtd = operacao === 'somar' ? item.quantidade + 1 : item.quantidade - 1;
          return { ...item, quantidade: novaQtd < 0 ? 0 : novaQtd };
        }
        return item;
      })
    );
  };

  // FUNÇÃO DE EXCLUSÃO CORRIGIDA PARA WEB E MOBILE
  const removerDoEstoque = (id: string) => {
    if (Platform.OS === 'web') {
      const confirmarWeb = window.confirm("Tem certeza que deseja remover este medicamento do estoque?");
      if (confirmarWeb) {
        setEstoque(prevEstoque => prevEstoque.filter(item => item.id !== id));
      }
    } else {
      Alert.alert(
        "Excluir Medicamento",
        "Tem certeza que deseja remover este medicamento do estoque?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Excluir", 
            style: "destructive", 
            onPress: () => {
              setEstoque(prevEstoque => prevEstoque.filter(item => item.id !== id));
            } 
          }
        ]
      );
    }
  };

  const handleAdicionarAoEstoque = () => {
    if (!nome.trim()) {
      Alert.alert('Aviso', 'Por favor, preencha o nome do medicamento.');
      return;
    }

    const novoMedicamento: ItemEstoque = {
      id: Date.now().toString(),
      codigo,
      nome,
      dosagem,
      formato,
      quantidade,
      validade,
    };

    setEstoque([novoMedicamento, ...estoque]);
    Alert.alert('Sucesso', 'Medicamento adicionado ao estoque local!');

    setCodigo('');
    setNome('');
    setDosagem('');
    setFormato('');
    setQuantidade(0);
    setValidade('');
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
            <Text style={styles.cameraText}>Aponte para o código de barras</Text>
            <View style={styles.scanTarget} />
            <TouchableOpacity style={styles.closeCameraButton} onPress={() => setIsScanning(false)}>
              <Text style={styles.closeCameraText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  const renderFormHeader = () => (
    <View style={styles.headerComponent}>
      <TouchableOpacity style={styles.scanButton} onPress={abrirCamera}>
        <Ionicons name="barcode-outline" size={32} color="#FFF" />
        <Text style={styles.scanButtonText}>Escanear Código de Barras</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Cadastrar Novo Lote / Medicamento</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A3C6B" />
          <Text style={styles.loadingText}>Consultando Base Nacional...</Text>
        </View>
      ) : (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Código (EAN)</Text>
          <TextInput style={styles.input} placeholder="Ex: 789..." placeholderTextColor="#999" keyboardType="numeric" value={codigo} onChangeText={setCodigo} />

          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} placeholder="Ex: Dipirona" placeholderTextColor="#999" value={nome} onChangeText={setNome} />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Dosagem</Text>
              <TextInput style={styles.input} placeholder="Ex: 500 mg" placeholderTextColor="#999" value={dosagem} onChangeText={setDosagem} />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Formato</Text>
              <TextInput style={styles.input} placeholder="Ex: Comprimido" placeholderTextColor="#999" value={formato} onChangeText={setFormato} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Qtd Inicial</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity style={styles.counterButton} onPress={diminuirQtdForm}>
                  <Ionicons name="remove" size={20} color="#1A3C6B" />
                </TouchableOpacity>
                <Text style={styles.counterText}>{quantidade}</Text>
                <TouchableOpacity style={styles.counterButton} onPress={aumentarQtdForm}>
                  <Ionicons name="add" size={20} color="#1A3C6B" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Validade</Text>
              <TextInput style={styles.input} placeholder="MM/AAAA" placeholderTextColor="#999" value={validade} onChangeText={setValidade} />
            </View>
          </View>
        </View>
      )}

      {!isLoading && (
        <TouchableOpacity style={styles.saveButton} onPress={handleAdicionarAoEstoque}>
          <Text style={styles.saveButtonText}>Adicionar ao Estoque</Text>
        </TouchableOpacity>
      )}

      <Text style={[styles.sectionTitle, { marginTop: 35, marginBottom: 5 }]}>Medicamentos Cadastrados</Text>
      <Text style={styles.subtitleList}>Altere as quantidades ou exclua nos botões abaixo:</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#1A3C6B" />
        </TouchableOpacity>
        <Text style={styles.title}>Gerenciar Estoque</Text>
      </View>

      <FlatList
        data={estoque}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderFormHeader}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.medCard}>
            <View style={styles.medCardInfo}>
              <Text style={styles.medCardName}>{item.nome}</Text>
              <Text style={styles.medCardSub}>{item.dosagem} {item.formato ? `• ${item.formato}` : ''}</Text>
              <Text style={styles.medCardValidade}>Validade: {item.validade}</Text>
            </View>

            <View style={styles.actionsContainer}>
              <View style={styles.listCounter}>
                {/* Correção do nome da função executada aqui */}
                <TouchableOpacity style={styles.listCounterButton} onPress={() => alterarQuantidadeItemLista(item.id, 'subtrair')}>
                  <Ionicons name="remove" size={18} color="#1A3C6B" />
                </TouchableOpacity>
                <Text style={styles.listCounterText}>{item.quantidade}</Text>
                <TouchableOpacity style={styles.listCounterButton} onPress={() => alterarQuantidadeItemLista(item.id, 'somar')}>
                  <Ionicons name="add" size={18} color="#1A3C6B" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.deleteButton} onPress={() => removerDoEstoque(item.id)}>
                <Ionicons name="trash-outline" size={22} color="#D32F2F" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6F0FA', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 20, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  backButton: { marginRight: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A3C6B' },
  contentContainer: { padding: 25, paddingBottom: 60 },
  headerComponent: { marginBottom: 10 },
  scanButton: { flexDirection: 'row', backgroundColor: '#1A3C6B', borderRadius: 20, padding: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 25, shadowColor: '#1A3C6B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  scanButtonText: { color: '#FFF', fontSize: 17, fontWeight: 'bold', marginLeft: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A3C6B', marginBottom: 15 },
  subtitleList: { fontSize: 14, color: '#666', marginBottom: 15, paddingLeft: 2 },
  formGroup: { marginBottom: 10 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#555', marginBottom: 5, marginLeft: 5 },
  input: { backgroundColor: '#FFF', borderRadius: 15, padding: 15, marginBottom: 15, fontSize: 15, color: '#333', borderWidth: 1, borderColor: '#D9E2EC' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  counterContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderRadius: 15, paddingHorizontal: 12, marginBottom: 15, borderWidth: 1, borderColor: '#D9E2EC', height: 50 },
  counterButton: { backgroundColor: '#E6F0FA', borderRadius: 8, padding: 4 },
  counterText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  saveButton: { backgroundColor: '#2F8F8F', borderRadius: 20, padding: 16, alignItems: 'center', shadowColor: '#2F8F8F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 },
  saveButtonText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  medCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 18, borderRadius: 15, marginBottom: 12, alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#EAEAEA' },
  medCardInfo: { flex: 1, marginRight: 10 },
  medCardName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  medCardSub: { fontSize: 13, color: '#777', marginBottom: 4 },
  medCardValidade: { fontSize: 12, color: '#999' },
  actionsContainer: { flexDirection: 'row', alignItems: 'center' },
  listCounter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4F8', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: '#D9E2EC' },
  listCounterButton: { backgroundColor: '#FFF', borderRadius: 8, padding: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  listCounterText: { fontSize: 15, fontWeight: 'bold', color: '#1A3C6B', marginHorizontal: 12 },
  deleteButton: { marginLeft: 12, padding: 5 },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  cameraOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  scanTarget: { width: 260, height: 160, borderWidth: 2, borderColor: '#00FF00', borderRadius: 12, backgroundColor: 'transparent', marginVertical: 30 },
  cameraText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center', paddingHorizontal: 20 },
  closeCameraButton: { backgroundColor: '#D32F2F', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 20, marginTop: 30 },
  closeCameraText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  loadingContainer: { padding: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: '#D9E2EC' },
  loadingText: { marginTop: 15, fontSize: 16, color: '#1A3C6B', fontWeight: 'bold' }
});