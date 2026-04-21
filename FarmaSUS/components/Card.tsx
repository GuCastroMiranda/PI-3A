import { Image, StyleSheet, Text, View } from "react-native"

interface PaiProps{
    title: string;
    nameFarmacia: string;
    status: boolean;
    endereco: string;
}

export default function Card ({ title, nameFarmacia, status, endereco}: PaiProps) {

    let typeStatus = 'Em estoque';
    let styleStatus = style.statusInStock;

    if(!status){
        typeStatus = 'Esgotado'
        styleStatus = style.statusRed;
    }   

    return (
        <View style={style.card}>
            <View >
                <Text style={style.title}>{title}</Text>

                <Text style={style.subtitle}>{nameFarmacia}</Text>

                <View style={style.infoContainer}>
                    <Text style={style.label}>
                        Status: <Text style={ styleStatus }>{ typeStatus }</Text>
                    </Text>

                    <Text style={style.label}>
                        Endereço: <Text style={style.address}>{ endereco }</Text>
                    </Text>
                </View>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    card: {
        backgroundColor: '#ffff',
        borderRadius: 12,
        padding: 16,
        margin:10,
        flexDirection: 'row',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Sombra para Android
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E1E8F0',
    },
    cardImg:{
        height: 120,
        paddingLeft: 30
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 18,
        color: '#9BA3AF',
        marginBottom: 16,
    },
    infoContainer: {
        gap: 4, 
    },
    label: {
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    statusInStock: {
        color: '#32D74B',
        fontWeight: '400',
    },
    statusRed:{
        color: '#ff0000',
        fontWeight: '400',
    },
    address: {
        color: '#1A1A1A',
        fontWeight: '400',
  },
});