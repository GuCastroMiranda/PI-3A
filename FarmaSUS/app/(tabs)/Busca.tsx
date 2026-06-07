import { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import Card from '@/components/ui/Card';
import MedicationDetailModal from '@/components/ui/MedicationDetailModal';
import { Medication } from '@/data/mock';

export default function SearchScreen() {
  const [busca, setBusca] = useState<string>('');
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [remedios] = useState<Medication[]>([
    {
      id: '1',
      name: 'Paracetamol - 750gm',
      pharmacy: 'Farmácia Central',
      inStock: true,
      address: 'EQS 415/416 - Asa Sul, Brasília - DF',
      description: 'Analgésico e antitérmico.'
    },
    {
      id: '2',
      name: 'Ibuprofeno - 400gm',
      pharmacy: 'Drogasil',
      inStock: true,
      address: 'Asa Sul, Brasília - DF',
      description: 'Anti-inflamatório, analgésico e antitérmico.'
    },
    {
      id: '3',
      name: 'Dipirona - 500gm',
      pharmacy: 'Pague Menos',
      inStock: true,
      address: 'Asa Norte, Brasília - DF',
      description: 'Analgésico e antitérmico.'
    },
    {
      id: '4',
      name: 'Paracetamol',
      pharmacy: 'Farmácia Central',
      inStock: true,
      address: 'EQS 415/416 - Asa Sul, Brasília - DF',
    },
    {
      id: '5',
      name: 'Paracetamol - 750mg',
      pharmacy: 'Rosaria',
      inStock: true,
      address: 'EQS 410/411 - Asa Sul, Brasília - DF' 
    },
    {
      id: '6',
      name: 'Dipirona - 1g',
      pharmacy: 'farma ++',
      inStock: true,
      address: 'EQS 210/211 - Asa Sul, Brasília - DF' 
    },
    {  
      id: '7',
      name: 'Loratadina - 10g',
      pharmacy: 'farma ++',
      inStock: true,
      address: 'EQS 210/211 - Asa Sul, Brasília - DF' 
    },
    {
      id: '8',
      name: 'Budesonida - 8,5ml',
      pharmacy: 'Rosaria',
      inStock: true,
      address: 'EQS 210/211 - Asa Sul, Brasília - DF' 
    }
  ]);

  const resultados = remedios.filter((item) =>
    item.name.toLowerCase().includes(busca.toLowerCase())
  );

  const handleOpenModal = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMedication(null);
  };

  return (
    <View style={styles.containe}>
        <View style={styles.container_input}>
            <TextInput
                placeholder="Buscar remédio..."
                value={busca}
                onChangeText={setBusca}
                style={styles.input}
            />
        </View>

      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            title={item.name}
            nameFarmacia={item.pharmacy}
            status={item.inStock}
            endereco={item.address}
            onPress={() => handleOpenModal(item)}
          />
        )}
      />

      <MedicationDetailModal 
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        medication={selectedMedication}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    containe:{
        backgroundColor: "#D3E4FE",
        flex: 1,
        padding: 10,
    },
    container_input:{
        marginTop: 50,
    },
    input:{
        height: 60,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        backgroundColor: '#ffff',
        borderRadius: 12,
        margin: 10,
    }
})