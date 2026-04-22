import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface textInput {
    title: string;
}

export const Input = ({ title }: textInput) => {
    const [text, setText] = useState('');
    
    return(
        <View style={style.container}>
            <TextInput
                style={style.input}
                placeholder={title}
                onChangeText={newText => setText(newText)}
                defaultValue={text}
            />
        </View>
    );
}

const style = StyleSheet.create({
    container: {
    },
    input: {
        height: 50,
        borderColor: 'gray',

        paddingHorizontal: 10,
        backgroundColor: '#ffff',
        borderRadius: 12,
        marginHorizontal: 30,
        marginVertical: 10,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10.84,
    }
})