import { Menu } from "@/components/Menu";
import { Redirect, Slot } from "expo-router";
import { View } from "react-native";

export default function _layout(){
    return (
        <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
            <Slot />
        </View>
        
        <Menu />
        </View>
    );
}