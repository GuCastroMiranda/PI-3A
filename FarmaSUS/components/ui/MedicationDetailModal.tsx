import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Medication } from '@/data/mock';

interface MedicationDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  medication: Medication | null;
}

export default function MedicationDetailModal({
  isVisible,
  onClose,
  medication,
}: MedicationDetailModalProps) {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible && medication) {
      if (medication.cep) {
        fetchAddress(medication.cep);
      } else {
        setAddress(medication.address);
      }
    } else {
      setAddress('');
    }
  }, [isVisible, medication]);

  const fetchAddress = async (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, '');
    if (cleanedCep.length !== 8) {
      setAddress(medication?.address || '');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        // "pegar as informação do logradouro, barrio localidade e estado"
        const fullAddress = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        setAddress(fullAddress);
      } else {
        setAddress(medication?.address || '');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setAddress(medication?.address || '');
    } finally {
      setLoading(false);
    }
  };

  if (!medication) return null;

  const handleOpenMaps = () => {
    const query = encodeURIComponent(`${address}, ${medication.pharmacy}`);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to browser
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
      }
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Detalhes do Medicamento</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#1A3C6B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.infoSection}>
              <Text style={styles.label}>Medicamento</Text>
              <Text style={styles.value}>{medication.name}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Farmácia / UBS</Text>
              <Text style={styles.value}>{medication.pharmacy}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusRow}>
                <Ionicons
                  name={medication.inStock ? "checkmark-circle" : "close-circle"}
                  size={20}
                  color={medication.inStock ? "#00B36B" : "#D32F2F"}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: medication.inStock ? "#00B36B" : "#D32F2F" },
                  ]}
                >
                  {medication.inStock ? "Em estoque" : "Sem estoque"}
                </Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Endereço</Text>
              {loading ? (
                <ActivityIndicator size="small" color="#1A3C6B" style={{ alignSelf: 'flex-start' }} />
              ) : (
                <Text style={styles.value}>{address}</Text>
              )}
            </View>

            {medication.description && (
              <View style={styles.infoSection}>
                <Text style={styles.label}>Descrição</Text>
                <Text style={styles.descriptionText}>{medication.description}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.mapsButton}
              onPress={handleOpenMaps}
              disabled={loading}
            >
              <Ionicons name="map-outline" size={20} color="#FFF" style={styles.buttonIcon} />
              <Text style={styles.mapsButtonText}>Ver no Google Maps</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    height: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A3C6B',
  },
  closeButton: {
    padding: 5,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
    fontWeight: '500',
  },
  value: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  mapsButton: {
    backgroundColor: '#1A3C6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  mapsButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
