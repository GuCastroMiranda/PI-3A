import { StyleSheet, View, Text, ScrollView } from 'react-native';

import { Card } from '@/components/Card';
import { Input } from '@/components/ui/Input';
import { Menu } from '@/components/Menu';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from '@/app/(auth)/login'

export default function HomeScreen() {

  return (
    <ScrollView style={styles.container}>
      <View style={styles.containertitle}>
        <Text style={styles.title}>Olá, Guilherme!</Text>
        <Text style={styles.subTitle}>Brasília, DF</Text>
      </View>

      <Input></Input>

      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
    
    </ScrollView>
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
