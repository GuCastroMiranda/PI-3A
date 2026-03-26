import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export const Menu = () => {

    return(
        <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tabButton}>
                <Ionicons name="home-outline" size={24} color="#8E8E93" />
            </TouchableOpacity>

      
            <TouchableOpacity style={styles.tabButton}>
                <Ionicons name="search-outline" size={26} color="#8E8E93" />
            </TouchableOpacity>

            {/*Perfil*/}
            <TouchableOpacity style={styles.tabButton}>
                <Ionicons name="person-outline" size={24} color="#8E8E93" />
            </TouchableOpacity>

            {/*Coração*/}
            <TouchableOpacity style={styles.tabButton}>
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
    
    position: 'absolute',       
    bottom: 0,
    width: '100%',
  },
  tabButton: {
    flex: 1,                 
    alignItems: 'center',        
    justifyContent: 'center',
  },
});