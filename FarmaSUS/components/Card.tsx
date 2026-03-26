import { StyleSheet, Text, View } from "react-native"

export const Card = ({children}: React.PropsWithChildren) => {


    return (
        <View style={style.card}>
            <Text style={style.title}>Paracetamol 750mg</Text>

            <Text style={style.subtitle}>UBS Asa SUL - Farmácia</Text>

            <View style={style.infoContainer}>
                <Text style={style.label}>
                    Status: <Text style={style.statusInStock}>Em estoque</Text>
                </Text>

                <Text style={style.label}>
                    Endereço: <Text style={style.address}>EQS 415/416</Text>
                </Text>
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

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Sombra para Android
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E1E8F0',
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
    address: {
        color: '#1A1A1A',
        fontWeight: '400',
  },
});