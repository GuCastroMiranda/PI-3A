import { StyleSheet, View, Text, ScrollView, FlatList } from 'react-native';

import  Card  from '@/components/Card';
import { Input } from '@/components/ui/Input';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState } from 'react';

import Login from '@/app/(auth)/login'

type Remedio = {
  id: string;
  title: string;
  nameFarmacia: string;
  status: boolean;
  endereco: string;
};

export default function HomeScreen() {

    const [remedios] = useState<Remedio[]>([
        {
            id: '1',
            title: 'Paracetamol',
            nameFarmacia: 'Farmácia Central',
            status: false,
            endereco: 'EQS 415/416',
        },
        {
            id: '2',
            title:'Paracetamol - 750mg',
            nameFarmacia:'Rosaria',
            status: true,
            endereco:'EQS 410/411' 
        },
        {
            id: '3',
            title:'Dipirona - 1g',
            nameFarmacia:'farma ++',
            status: true,
            endereco:'EQS 210/211' 
        },
        {  
            id: '4',
            title:'Loratadina - 10g',
            nameFarmacia:'farma ++',
            status: false,
            endereco:'EQS 210/211' 
        },
        {
            id: '5',
            title:'Budesonida - 8,5ml',
            nameFarmacia:'Rosaria',
            status: true,
            endereco:'EQS 210/211' 
        }
    ]);

    const resultados = remedios.filter((item) =>
      item.title.toLowerCase()
    );

  return (
    <View style={styles.container}>
      <View style={styles.containertitle}>
        <Text style={styles.title}>Olá, Guilherme!</Text>
        <Text style={styles.subTitle}>Brasília, DF</Text>
      </View>

      <Input></Input>
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
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: "#D3E4FE",
  },
  containertitle:{
    margin: 10,
    paddingTop: 63
  },
  title:{
    fontSize: 30,
    color: '#174680',
    fontWeight: 'bold'
  },
  subTitle:{

  }
})
