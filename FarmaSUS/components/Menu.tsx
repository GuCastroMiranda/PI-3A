import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

export const Menu = () => {

    const isLogged = false; 

    const handleProtectedNavigation = (route: string) => {
        if (!isLogged) {

        router.push('/login'); 
        } else {
        router.push(route);
        }
    };

    return(
        <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tabButton}
                onPress={() => router.push('/')}
            >
                <Ionicons name="home-outline" size={24} color="#8E8E93" />
            </TouchableOpacity>

      
            <TouchableOpacity style={styles.tabButton}
                onPress={() => handleProtectedNavigation('Busca')}
            >
                <Ionicons name="search-outline" size={26} color="#8E8E93" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton}
                onPress={() => handleProtectedNavigation('Perfil')}
            >
                <Ionicons name="person-outline" size={24} color="#8E8E93" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton}
                onPress={() => handleProtectedNavigation('favoritos')}
            >
                <Ionicons name="heart-outline" size={24} color="#8E8E93" />
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF',  
    height: 70,              
    justifyContent: 'space-around',
    alignItems: 'center',          
    
    position: 'sticky',       
    bottom: 0,
    width: '100%',
  },
  tabButton: {
    flex: 1,                 
    alignItems: 'center',        
    justifyContent: 'center',
  },
});