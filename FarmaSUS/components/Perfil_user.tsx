import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import  Card  from '@/components/Card'

type Remedio = {
  id: string;
  title: string;
  nameFarmacia: string;
  status: boolean;
  endereco: string;
};

export const CardPerfil = () => {

    let name: String = 'Guilherme Duarte'
    let email: String = 'exemplo@gmail.com'
    let Celular: String = '9999999999'
    let CPF: String = 'exemplo@gmail.com'
    let CEP: String = 'exemplo@gmail.com'


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
        },
        {
            id: '6',
            title: 'Paracetamol - 750gm',
            nameFarmacia: 'Farmácia Central',
            status: true,
            endereco: 'EQS 415/416',
        },
        {
            id: '7',
            title: 'Ibuprofeno - 400gm',
            nameFarmacia: 'Drogasil',
            status: true,
            endereco: 'Asa Sul',
        },
        {
            id: '8',
            title: 'Dipirona - 500gm',
            nameFarmacia: 'Pague Menos',
            status: true,
            endereco: 'Asa Norte',
        },
    ]);

    
    const resultados = remedios.filter((item) =>
    item.title.toLowerCase()
    );

    return(
        <View style={styles.container_Card}>
            <View style={styles.container_Perfil}>
                <View style={styles.img_User}>
                    <Feather name="user" size={100} color="black" />
                </View>
                <View>
                    <Text style={styles.titulo}>{name}</Text>
                    <View style={styles.user}>
                        <Text style={styles.subtitle}>Email: {email}</Text>
                        <Text style={styles.subtitle}>Celular: 99 9999-9999</Text>
                        <Text style={styles.subtitle}>CPF: 000.000.000-00</Text>
                        <Text style={styles.subtitle}>CEP: 00.000-000</Text>
                    </View>
                </View>
            </View>
            <View> 
                <View>
                    <Text style={styles.title_historico}> Historico de compras</Text>
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
        </View>
    )
}

const styles = StyleSheet.create({
    container_Card:{
        backgroundColor: "#D3E4FE",
    },
    container_Perfil:{
        flexDirection: 'row',
        marginTop: 50,
        alignItems: 'center',
    },
    img_User:{
        borderRadius: 100,
        borderWidth: 5,
        width: '30%',
        alignItems: 'center',
        backgroundColor: '#ffff',
        marginLeft: 10,
        marginRight: 10,
        padding: 4
    },
    user:{
        backgroundColor: '#ffff',
        padding: 5,
        borderRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E1E8F0',
    },
    titulo:{
        fontSize: 30,
        color: '#174680',
        fontWeight: 'bold',
        marginBottom: 10,
        textDecorationLine: 'underline',
    },
    subtitle:{
        fontSize: 15,
        color: 'black',
        marginBottom: 5
    },
    title_historico:{
        fontSize: 25,
        color: 'black',
        fontWeight: 'bold',
        margin: 10,
    },
});