import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from "expo-router";
import { StyleSheet, TouchableOpacity, View, Platform } from "react-native";

export const Menu = () => {
    const isLogged = true;
    const pathname = usePathname();

    const handleProtectedNavigation = (route: string) => {
        if (!isLogged) {
            router.push('/login');
        } else {
            router.push(route as any);
        }
    };

    const isActive = (route: string) => pathname === route || pathname === `${route}/`;

    const getIconColor = (route: string) => isActive(route) ? '#1A3C6B' : '#A0B4C8';
    
    const getIconName = (route: string, outline: any, filled: any) => isActive(route) ? filled : outline;

    return (
        <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/')}>
                <Ionicons name={getIconName('/', 'home-outline', 'home')} size={26} color={getIconColor('/')} />
                {isActive('/') && <View style={styles.activeIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton} onPress={() => handleProtectedNavigation('/Busca')}>
                <Ionicons name={getIconName('/Busca', 'search-outline', 'search')} size={26} color={getIconColor('/Busca')} />
                {isActive('/Busca') && <View style={styles.activeIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton} onPress={() => handleProtectedNavigation('/Perfil')}>
                <Ionicons name={getIconName('/Perfil', 'person-outline', 'person')} size={26} color={getIconColor('/Perfil')} />
                {isActive('/Perfil') && <View style={styles.activeIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton} onPress={() => handleProtectedNavigation('/favoritos')}>
                <Ionicons name={getIconName('/favoritos', 'heart-outline', 'heart')} size={26} color={getIconColor('/favoritos')} />
                {isActive('/favoritos') && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        height: Platform.OS === 'ios' ? 85 : 70,
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        paddingBottom: Platform.OS === 'ios' ? 15 : 0,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        position: 'relative',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 12 : 10,
        width: 25,
        height: 3,
        backgroundColor: '#2F8F8F',
        borderRadius: 2,
    }
});