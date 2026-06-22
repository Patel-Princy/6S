import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable, ImageBackground, Animated, Dimensions } from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

const { width } = Dimensions.get('window');

const STATUS_COLORS = { Green: '#1A8C4E', Yellow: '#B07D10', Red: '#C0182A' };

const ZPOS = [
  {id:1, left:'62.9%', top:'11.9%'},
  {id:2, left:'51.5%', top:'25.0%'},
  {id:3, left:'60.1%', top:'41.5%'},
  {id:4, left:'32.8%', top:'32.9%'},
  {id:5, left:'30.2%', top:'45.3%'},
  {id:6, left:'42.1%', top:'11.9%'},
  {id:7, left:'11.9%', top:'26.6%'},
  {id:8, left:'70.8%', top:'69.2%'}
];

const mockZones = [
  { id: '1', name: 'Zone 1', status: 'Green', score: 95 },
  { id: '2', name: 'Zone 2', status: 'Green', score: 88 },
  { id: '3', name: 'Zone 3', status: 'Green', score: 92 },
  { id: '4', name: 'Zone 4', status: 'Yellow', score: 75 },
  { id: '5', name: 'Zone 5', status: 'Green', score: 85 },
  { id: '6', name: 'Zone 6', status: 'Red', score: 55 },
  { id: '7', name: 'Zone 7', status: 'Yellow', score: 68 },
  { id: '8', name: 'Zone 8', status: 'Green', score: 90 },
];

const PulsingDot = ({ pos, color, isActive, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        position: 'absolute',
        top: pos.top, 
        left: pos.left, 
        zIndex: isActive ? 10 : 1,
      }}
    >
      <Animated.View 
        style={[
          styles.mapZoneDot, 
          { 
            backgroundColor: color,
            shadowColor: color,
            borderColor: isActive ? '#FFFFFF' : 'transparent',
            borderWidth: isActive ? 3 : 0,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <Text style={styles.mapZoneDotText}>{pos.id}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function DashboardMapScreen() {
  const [activeZoneId, setActiveZoneId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleZonePress = (id) => {
    setActiveZoneId(id);
    setModalVisible(true);
  };

  const activeZone = mockZones.find(z => z.id === activeZoneId?.toString());

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>Live Campus Zone Map — Annexure I</Text>
        <Text style={styles.mapSubtitle}>Pan to explore. Tap '+' or '-' to zoom in and out.</Text>
        
        <View style={styles.interactiveMapArea}>
          <ReactNativeZoomableView
            maxZoom={3}
            minZoom={1}
            zoomStep={0.5}
            initialZoom={1}
            bindToBorders={true}
            style={styles.zoomableView}
          >
            <ImageBackground 
              source={require('../assets/campus_map.png')} 
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            >
            {ZPOS.map((pos) => {
              const matchingZone = mockZones.find(z => z.id === pos.id.toString());
              const status = matchingZone ? matchingZone.status : 'Green';
              const color = STATUS_COLORS[status];
              const isActive = activeZoneId === pos.id;
              return (
                <PulsingDot 
                  key={pos.id}
                  pos={pos}
                  color={color}
                  isActive={isActive}
                  onPress={() => handleZonePress(pos.id)}
                />
              )
            })}
            </ImageBackground>
          </ReactNativeZoomableView>
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: STATUS_COLORS.Green }]} />
            <Text style={styles.legendText}>On time / within 7-day review</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: STATUS_COLORS.Yellow }]} />
            <Text style={styles.legendText}>1 day late / overdue review</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: STATUS_COLORS.Red }]} />
            <Text style={styles.legendText}>2+ days late / severely overdue</Text>
          </View>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackgroundPress} onPress={() => setModalVisible(false)} />
          <View style={styles.modalContent}>
            {activeZone && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalEyebrow}>Zone {activeZone.id} Preview</Text>
                  <Text style={styles.modalTitle}>{activeZone.name}</Text>
                  <Text style={styles.modalSubtitle}>Status: {activeZone.status}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[activeZone.status] }]}>
                    <Text style={styles.statusBadgeText}>{activeZone.status} Status ({activeZone.score}%)</Text>
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBarFill, { backgroundColor: STATUS_COLORS[activeZone.status], width: `${activeZone.score}%` }]} />
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Checklist</Text>
                    <Text style={styles.detailValue}>Complete</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Last Submission</Text>
                    <Text style={styles.detailValue}>Today</Text>
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close Preview</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF7F2',
    padding: 16,
    justifyContent: 'center', // Added to center it nicely
  },
  mapContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(140,27,47,0.12)',
    shadowColor: '#1C0A0E',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
    elevation: 2,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8C1B2F',
    marginBottom: 6,
  },
  mapSubtitle: {
    fontSize: 13,
    color: '#7A4050',
    marginBottom: 20,
  },
  interactiveMapArea: {
    width: '100%',
    aspectRatio: 1, // Changed slightly for a balanced look, original was 860/620
    backgroundColor: '#F5EFE6',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(140,27,47,0.12)',
  },
  zoomableView: {
    flex: 1,
  },
  mapZoneDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    elevation: 4,
  },
  mapZoneDotText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  legendContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(140,27,47,0.1)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendText: {
    fontSize: 13,
    color: '#4A2030',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 10, 14, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackgroundPress: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FBF7F2',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalEyebrow: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C4933F',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C0A0E',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#7A4050',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#EDE4D6',
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(140,27,47,0.1)',
    marginVertical: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#7A4050',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C0A0E',
  },
  closeButton: {
    backgroundColor: '#8C1B2F',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  }
});
