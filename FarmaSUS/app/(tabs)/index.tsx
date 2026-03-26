import { StyleSheet, View, Text } from 'react-native';

import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Menu } from '@/components/Menu';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.containertitle}>
        <Text style={styles.title}>Olá, Guilherme!</Text>
        <Text style={styles.subTitle}>Brasília, DF</Text>
      </View>

      <Input></Input>

      <Card></Card>
      <Card></Card>
      <Card></Card>
      <Card></Card>
    
      <Menu></Menu>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
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
