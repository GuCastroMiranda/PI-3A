import { Menu } from "@/components/Menu";
import { Redirect, Slot } from "expo-router";
import { View } from "react-native";

export default function _layout(){
    const isLogged = false;

    if(!isLogged) {
        return <Redirect href="/(auth)/login" />
    }

    return <Slot />;
}