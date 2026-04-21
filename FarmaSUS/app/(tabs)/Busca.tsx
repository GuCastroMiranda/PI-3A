import { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, ScrollView } from 'react-native';
import Card from '@/components/Card';

type Remedio = {
  id: string;
  title: string;
  nameFarmacia: string;
  status: boolean;
  endereco: string;
};

export default function SearchScreen() {
  const [busca, setBusca] = useState<string>('');

  const [remedios] = useState<Remedio[]>([
    {
      id: '1',
      title: 'Paracetamol - 750gm',
      nameFarmacia: 'Farmácia Central',
      status: true,
      endereco: 'EQS 415/416',
    },
    {
      id: '2',
      title: 'Ibuprofeno - 400gm',
      nameFarmacia: 'Drogasil',
      status: true,
      endereco: 'Asa Sul',
    },
    {
      id: '3',
      title: 'Dipirona - 500gm',
      nameFarmacia: 'Pague Menos',
      status: true,
      endereco: 'Asa Norte',
    },
    {
    id: '4',
    title: 'Paracetamol',
    nameFarmacia: 'Farmácia Central',
    status: true,
    endereco: 'EQS 415/416',
},
{
    id: '5',
    title:'Paracetamol - 750mg',
    nameFarmacia:'Rosaria',
    status: true,
    endereco:'EQS 410/411' 
},
{
    id: '6',
    title:'Dipirona - 1g',
    nameFarmacia:'farma ++',
    status: true,
    endereco:'EQS 210/211' 
},
{  
    id: '7',
    title:'Loratadina - 10g',
    nameFarmacia:'farma ++',
    status: true,
    endereco:'EQS 210/211' 
},
{
    id: '8',
    title:'Budesonida - 8,5ml',
    nameFarmacia:'Rosaria',
    status: true,
    endereco:'EQS 210/211' 
}
  ]);


  const resultados = remedios.filter((item) =>
    item.title.toLowerCase().includes(busca.toLowerCase())
  );

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
            title={item.title}
            nameFarmacia={item.nameFarmacia}
            status={item.status}
            endereco={item.endereco}
          />
        )}
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