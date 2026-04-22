import { StyleSheet, Text, View } from "react-native";

interface PaiProps {
    title: string;
    nameFarmacia: string;
    status: boolean;
    endereco: string;
}

export default function Card({ title, nameFarmacia, status, endereco }: PaiProps) {
    const typeStatus = status ? 'Em estoque' : 'Sem estoque';
    const styleStatus = status ? style.statusInStock : style.statusRed;

    return (
        <View style={style.card}>
            <Text style={style.title}>{title}</Text>
            <Text style={style.subtitle}>{nameFarmacia}</Text>

            <View style={style.infoContainer}>
                <View style={style.row}>
                    <Text style={style.label}>Status: </Text>
                    <Text style={[style.label, styleStatus]}>{typeStatus}</Text>
                </View>

                <View style={style.row}>
                    <Text style={style.label}>Endereço: </Text>
                    <Text style={style.address}>{endereco}</Text>
                </View>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 15,
    },
    infoContainer: {
        gap: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    label: {
        fontSize: 13,
        color: '#555',
    },
    statusInStock: {
        color: '#00B36B',
        fontWeight: 'bold',
    },
    statusRed: {
        color: '#D32F2F',
        fontWeight: 'bold',
    },
    address: {
        fontSize: 13,
        color: '#555',
    },
});