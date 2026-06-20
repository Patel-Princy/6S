import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Dimensions, ImageBackground, Modal } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';
import { useAppState } from '../context/AppStateContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { zonesData, getSubZonesForZone } from '../data/zones';

const screenWidth = Dimensions.get('window').width;

export default function AdminDashboard({ navigation }) {
  const { checklists, complaints } = useAppState();
  const [advisory, setAdvisory] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedSubZone, setSelectedSubZone] = useState('All');
  const [hoveredZone, setHoveredZone] = useState(null);

  const [advisories, setAdvisories] = useState([
    { id: '1', text: 'Please ensure all chemical wastes are properly labeled.', zone: 'zone_2', subZone: 'z2_sz1', timestamp: new Date(Date.now() - 86400000).toLocaleString(), responsible: 'Admin', replies: [] }
  ]);

  const chartConfig = {
    backgroundGradientFrom: COLORS.background,
    backgroundGradientTo: COLORS.background,
    color: (opacity = 1) => COLORS.primary,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => COLORS.text,
  };

  const sixSData = {
    labels: ['Sort', 'Set', 'Shine', 'Std.', 'Sustain', 'Safety'],
    datasets: [
      {
        data: [85, 70, 90, 60, 80, 95]
      }
    ]
  };

  const pieData = [
    { name: 'Green', population: 50, color: COLORS.success, legendFontColor: COLORS.textMuted, legendFontSize: 12 },
    { name: 'Yellow', population: 30, color: COLORS.warning, legendFontColor: COLORS.textMuted, legendFontSize: 12 },
    { name: 'Red', population: 20, color: COLORS.error, legendFontColor: COLORS.textMuted, legendFontSize: 12 },
  ];

  const handlePublish = () => {
    if(!advisory) return;
    const newAdv = {
      id: Date.now().toString(),
      text: advisory,
      zone: selectedZone,
      subZone: selectedSubZone,
      timestamp: new Date().toLocaleString(),
      responsible: 'Admin',
      replies: []
    };
    setAdvisories([newAdv, ...advisories]);
    setAdvisory('');
    alert('Advisory Published Successfully');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.topBar}>
          <View>
            <Text style={styles.sysTitle}>6S Management System</Text>
            <Text style={styles.sysSub}>Master Dashboard</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Level 4 - Admin</Text>
            <TouchableOpacity onPress={() => navigation.replace('LoginScreen')} style={styles.logoutBtn}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 6S Analysis Charts */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Campus 6S Analysis</Text>
          <BarChart
            data={sixSData}
            width={screenWidth - 60}
            height={220}
            yAxisLabel=""
            yAxisSuffix="%"
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overall Status Distribution</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 60}
            height={200}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        </View>

        {/* Campus Map Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Campus Map</Text>
          <Text style={styles.mapHint}>Pan to explore. Tap on a zone marker to view progress.</Text>
          <ImageBackground 
            source={require('../assets/campus_map.png')} 
            style={[styles.mapContainer, { borderWidth: 1, borderColor: '#ccc' }]} 
            imageStyle={{ borderRadius: 8, resizeMode: 'cover' }}
          >
            {zonesData.map((zone, index) => {
              // Custom map coordinates roughly matching the provided reference image
              const coordinates = [
                { top: 20, right: 40 }, // Zone 1
                { top: 70, right: 100 }, // Zone 2
                { top: 120, right: 60 }, // Zone 3
                { top: 90, left: 100 }, // Zone 4
                { top: 130, left: 90 }, // Zone 5
                { top: 40, left: 160 }, // Zone 6
                { top: 100, left: 30 }, // Zone 7
                { bottom: 20, right: 30 } // Zone 8
              ];
              const pos = coordinates[index] || { top: index * 40, left: index * 40 };

              // Determine color based on index (mock logic: green, yellow, red)
              let color = COLORS.success;
              if (index === 1 || index === 6) color = COLORS.warning;
              if (index === 5) color = COLORS.error;

              return (
                <TouchableOpacity 
                  key={zone.id}
                  style={[styles.mapZone, pos, { backgroundColor: color }]} 
                  onPress={() => {
                    setSelectedZone(zone.id);
                    setSelectedSubZone('All');
                    setHoveredZone({
                       id: zone.id,
                       name: zone.name,
                       head: zone.head,
                       progress: sixSData.datasets[0].data[index % sixSData.datasets[0].data.length],
                       status: color === COLORS.success ? 'Good' : color === COLORS.warning ? 'Needs Attention' : 'Critical',
                       color: color
                    });
                  }}
                >
                  <Text style={styles.mapZoneText}>{zone.id.split('_')[1]}</Text>
                </TouchableOpacity>
              );
            })}
          </ImageBackground>
        </View>

        {/* Advisory Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Publish Global Advisory</Text>
          
          <Text style={styles.label}>Target Zone:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            <TouchableOpacity onPress={() => { setSelectedZone('All'); setSelectedSubZone('All'); }} style={[styles.filterChip, selectedZone === 'All' && styles.filterChipActive]}>
              <Text style={[styles.filterChipText, selectedZone === 'All' && styles.filterChipTextActive]}>All Zones</Text>
            </TouchableOpacity>
            {zonesData.map(z => (
              <TouchableOpacity key={z.id} onPress={() => { setSelectedZone(z.id); setSelectedSubZone('All'); }} style={[styles.filterChip, selectedZone === z.id && styles.filterChipActive]}>
                <Text style={[styles.filterChipText, selectedZone === z.id && styles.filterChipTextActive]}>{z.name.split(' ')[1]} {z.name.split(' ')[2]}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedZone !== 'All' && (
             <View>
               <Text style={styles.label}>Target Sub-Zone:</Text>
               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                 <TouchableOpacity onPress={() => setSelectedSubZone('All')} style={[styles.filterChip, selectedSubZone === 'All' && styles.filterChipActive]}>
                   <Text style={[styles.filterChipText, selectedSubZone === 'All' && styles.filterChipTextActive]}>All Sub-zones</Text>
                 </TouchableOpacity>
                 {getSubZonesForZone(selectedZone).map(sz => (
                   <TouchableOpacity key={sz.id} onPress={() => setSelectedSubZone(sz.id)} style={[styles.filterChip, selectedSubZone === sz.id && styles.filterChipActive]}>
                     <Text style={[styles.filterChipText, selectedSubZone === sz.id && styles.filterChipTextActive]}>{sz.name}</Text>
                   </TouchableOpacity>
                 ))}
               </ScrollView>
             </View>
          )}

          <TextInput
            style={styles.input}
            value={advisory}
            onChangeText={setAdvisory}
            placeholder="Enter system-wide observations, recommendations, or advisories..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity style={styles.button} onPress={handlePublish}>
            <Text style={styles.buttonText}>Publish Advisory</Text>
          </TouchableOpacity>
        </View>

        {/* Advisories Log */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Advisories Log</Text>
          {advisories.map(adv => (
            <View key={adv.id} style={styles.advisoryItem}>
              <Text style={styles.advText}>{adv.text}</Text>
              <View style={styles.advMetaRow}>
                <Text style={styles.advMeta}>Zone: {adv.zone === 'All' ? 'All' : adv.zone}</Text>
                <Text style={styles.advMeta}>Sub: {adv.subZone === 'All' ? 'All' : adv.subZone}</Text>
              </View>
              <View style={styles.advMetaRow}>
                <Text style={styles.advMeta}>By: {adv.responsible}</Text>
                <Text style={styles.advMeta}>{adv.timestamp}</Text>
              </View>
              {adv.replies && adv.replies.length > 0 && (
                <View style={styles.repliesContainer}>
                  {adv.replies.map((rep, idx) => (
                     <Text key={idx} style={styles.replyText}>- {rep.text} ({rep.by})</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Map Zone Hover Dialog */}
        <Modal
          visible={!!hoveredZone}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setHoveredZone(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {hoveredZone && (
                <>
                  <View style={[styles.modalHeader, { backgroundColor: hoveredZone.color }]}>
                    <Text style={styles.modalTitle}>Zone {hoveredZone.id.split('_')[1]}</Text>
                  </View>
                  <View style={styles.modalBody}>
                    <Text style={styles.modalZoneName}>{hoveredZone.name}</Text>
                    <Text style={styles.modalHead}>Head: {hoveredZone.head}</Text>
                    <View style={styles.modalStatRow}>
                      <Text style={styles.modalStatLabel}>Compliance Progress:</Text>
                      <Text style={[styles.modalStatValue, { color: hoveredZone.color }]}>{hoveredZone.progress}%</Text>
                    </View>
                    <View style={styles.modalStatRow}>
                      <Text style={styles.modalStatLabel}>Overall Status:</Text>
                      <Text style={[styles.modalStatValue, { color: hoveredZone.color }]}>{hoveredZone.status}</Text>
                    </View>
                    <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setHoveredZone(null)}>
                      <Text style={styles.modalCloseText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SIZES.padding },
  
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sysTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  sysSub: { fontSize: 12, color: COLORS.textMuted },
  userInfo: { alignItems: 'flex-end' },
  userName: { fontSize: 12, color: COLORS.primary, fontWeight: 'bold', marginBottom: 4 },
  logoutBtn: { backgroundColor: COLORS.primaryDim, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 },
  logoutText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },

  card: { backgroundColor: COLORS.surface, padding: 16, borderRadius: SIZES.radius, marginBottom: 20, elevation: 2, borderWidth: 1, borderColor: COLORS.border },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginBottom: 16 },

  label: { fontSize: 12, color: COLORS.textMuted, marginBottom: 8 },
  filterRow: { flexDirection: 'row', marginBottom: 16 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { fontSize: 12, color: COLORS.textMuted },
  filterChipTextActive: { color: COLORS.surface, fontWeight: 'bold' },

  input: { width: '100%', height: 100, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, padding: 12, fontSize: 14, color: COLORS.text, textAlignVertical: 'top', marginBottom: 16 },
  button: { width: '100%', height: 45, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  buttonText: { color: COLORS.surface, fontSize: 16, fontWeight: 'bold' },

  advisoryItem: { borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingVertical: 12 },
  advText: { fontSize: 14, color: COLORS.text, marginBottom: 8, fontWeight: '500' },
  advMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  advMeta: { fontSize: 11, color: COLORS.textMuted },
  repliesContainer: { marginTop: 8, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: COLORS.primaryDim },
  replyText: { fontSize: 12, color: COLORS.secondary, fontStyle: 'italic' },
  
  mapContainer: { height: 200, width: '100%', position: 'relative', backgroundColor: COLORS.background, borderRadius: 8, overflow: 'hidden' },
  mapZone: { position: 'absolute', backgroundColor: COLORS.primary, padding: 8, borderRadius: 20, minWidth: 36, minHeight: 36, justifyContent: 'center', alignItems: 'center' },
  mapZoneText: { color: COLORS.surface, fontSize: 14, fontWeight: 'bold' },
  mapHint: { fontSize: 12, color: COLORS.textMuted, marginBottom: 12 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: COLORS.surface, borderRadius: 12, overflow: 'hidden', elevation: 5 },
  modalHeader: { padding: 16, alignItems: 'center' },
  modalTitle: { color: COLORS.surface, fontSize: 18, fontWeight: 'bold' },
  modalBody: { padding: 20 },
  modalZoneName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  modalHead: { fontSize: 14, color: COLORS.textMuted, marginBottom: 16 },
  modalStatRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  modalStatLabel: { fontSize: 14, color: COLORS.text },
  modalStatValue: { fontSize: 14, fontWeight: 'bold' },
  modalCloseBtn: { marginTop: 20, backgroundColor: COLORS.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  modalCloseText: { color: COLORS.surface, fontWeight: 'bold', fontSize: 16 }
});
