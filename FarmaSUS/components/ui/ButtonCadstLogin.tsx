import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

interface MyButtonProps {
    title: string;
    onPress: () => void;
    color?: string;
    isLoading?: boolean;
}

export default function ButtonCadstLogin({ title, onPress, color = '#2196F3', isLoading }: MyButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: color }]}
            onPress={onPress}
            disabled={isLoading}
            activeOpacity={0.7}
        >
            {isLoading ? (
                <ActivityIndicator color={'#fff'} />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    text: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});