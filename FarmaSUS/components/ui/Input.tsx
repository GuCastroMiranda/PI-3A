import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export const Input = () => {
    const [text, setText] = useState('');
    
    return(
        <View style={style.container}>
            <TextInput
                style={style.input}
                placeholder="Buscar"
                onChangeText={newText => setText(newText)}
                defaultValue={text}
            />
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 35,
        marginTop: 21
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        backgroundColor: '#ffff',
        borderRadius: 12,
        margin: 10
    }
})