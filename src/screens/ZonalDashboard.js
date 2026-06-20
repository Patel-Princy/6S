import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, FlatList } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';
import { useAppState } from '../context/AppStateContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { zonesData } from '../data/zones';

export default function ZonalDashboard({ route, navigation }) {
  const { loginId } = route.params || {};
  const { checklists, complaints } = useAppState();
  
  // Default to Zone 1 if loginId doesn't specify
  const [zoneId, setZoneId] = useState('zone_1');
  const [zoneDetails, setZoneDetails] = useState(null);
  
  const [selectedSubZone, setSelectedSubZone] = useState(null);
  const [remark, setRemark] = useState('');

  // Mock Data for demonstration
  const [remarksHistory, setRemarksHistory] = useState([
    { id: 1, subZone: 'z1_sz1', text: 'Please ensure lobby is cleaned twice a day.', timestamp: '2026-06-18 10:00 AM', by: 'Prof. Devjani Banerjee', actionTime: 'Pending' }
  ]);

  useEffect(() => {
    let zId = 'zone_1';
    if (loginId && loginId.includes('zone2')) zId = 'zone_2';
    else if (loginId && loginId.includes('zone3')) zId = 'zone_3';
    
    setZoneId(zId);
    const zInfo = zonesData.find(z => z.id === zId);
    setZoneDetails(zInfo);
    if (zInfo && zInfo.subZones.length > 0) {
      setSelectedSubZone(zInfo.subZones[0]);
    }
  }, [loginId]);

  const handleDispatchRemark = () => {
    if (!remark) return;
    const newRemark = {
      id: Date.now(),
      subZone: selectedSubZone.id,
      text: remark,
      timestamp: new Date().toLocaleString(),
      by: zoneDetails?.head,
      actionTime: 'Pending'
    };
    setRemarksHistory([newRemark, ...remarksHistory]);
    setRemark('');
    alert('Remark Dispatched successfully');
  };

  const renderLeftPanel = () => {
    return (
      <View style={styles.leftPanel}>
        <Text style={styles.panelTitle}>Sub-Zonal Logs</Text>
        <ScrollView>
          {zoneDetails?.subZones.map(sz => (
            <TouchableOpacity 
              key={sz.id} 
              style={[styles.szListItem, selectedSubZone?.id === sz.id && styles.szListItemActive]}
              onPress={() => setSelectedSubZone(sz)}
            >
              <Text style={[styles.szListText, selectedSubZone?.id === sz.id && styles.szListTextActive]}>{sz.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderRightPanel = () => {
    if (!selectedSubZone) {
      return <View style={styles.rightPanel}><Text>Select a Sub-Zone</Text></View>;
    }

    const subZoneRemarks = remarksHistory.filter(r => r.subZone === selectedSubZone.id);
    const subZoneConcerns = complaints.filter(c => c.subZone === selectedSubZone.name || c.subZone === selectedSubZone.id); // Loose mock match

    return (
      <ScrollView style={styles.rightPanel}>
        <Text style={styles.contentTitle}>{selectedSubZone.name}</Text>
        <Text style={styles.contentSubtitle}>Coordinator: {selectedSubZone.coordinator}</Text>

        <View style={styles.progressCard}>
          <Text style={styles.cardHeader}>Progress Report</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10}}>
            <Text style={{color: COLORS.text}}>Overall Status:</Text>
            <Text style={{color: COLORS.success, fontWeight: 'bold'}}>Good</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: COLORS.text}}>Compliance Progress:</Text>
            <Text style={{fontWeight: 'bold', color: COLORS.primary}}>85%</Text>
          </View>
        </View>

        <View style={styles.inputCard}>
           <Text style={styles.cardHeader}>Add Commit Remark</Text>
           <TextInput
              style={styles.input}
              value={remark}
              onChangeText={setRemark}
              placeholder={`Write remark for ${selectedSubZone.name}...`}
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity style={styles.button} onPress={handleDispatchRemark}>
              <Text style={styles.buttonText}>Dispatch Remark</Text>
            </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Commit Remarks History</Text>
        {subZoneRemarks.length === 0 && <Text style={{color: COLORS.textMuted, marginBottom: 16}}>No remarks for this sub-zone yet.</Text>}
        {subZoneRemarks.map(r => (
          <View key={r.id} style={styles.historyCard}>
            <Text style={styles.historyText}>{r.text}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>By: {r.by}</Text>
              <Text style={styles.metaText}>Time: {r.timestamp}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>Sub-Zone: {selectedSubZone.name}</Text>
              <Text style={styles.metaText}>Action Taken: {r.actionTime}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionHeader}>Zone Concerns (Student Requests)</Text>
        {subZoneConcerns.length === 0 && <Text style={{color: COLORS.textMuted, marginBottom: 16}}>No student concerns for this sub-zone.</Text>}
        {subZoneConcerns.map((c, i) => (
           <View key={i} style={styles.historyCard}>
             <Text style={styles.historyText}>{c.description}</Text>
             <View style={styles.metaRow}>
               <Text style={styles.metaText}>Raised By: Level 1 (Student)</Text>
               <Text style={styles.metaText}>Time: {c.reportedAt || 'Just now'}</Text>
             </View>
             <View style={styles.metaRow}>
               <Text style={styles.metaText}>Sub-Zone Incharge: {selectedSubZone.coordinator}</Text>
               <Text style={styles.metaText}>Status: {c.status}</Text>
             </View>
           </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
           <Text style={styles.title}>Zonal Head Dashboard</Text>
           <Text style={styles.subtitle}>{zoneDetails?.name} - {zoneDetails?.head}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {renderLeftPanel()}
        {renderRightPanel()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderColor: COLORS.border },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  logoutBtn: { backgroundColor: COLORS.primaryDim, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4, alignSelf: 'center' },
  logoutText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },

  mainContent: { flex: 1, flexDirection: 'row' },
  
  leftPanel: { width: '35%', backgroundColor: COLORS.surface, borderRightWidth: 1, borderColor: COLORS.border, paddingVertical: 10 },
  panelTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginLeft: 16, marginBottom: 10, textTransform: 'uppercase' },
  szListItem: { padding: 12, paddingLeft: 16, borderBottomWidth: 1, borderColor: COLORS.border },
  szListItemActive: { backgroundColor: COLORS.primaryDim, borderRightWidth: 4, borderColor: COLORS.primary },
  szListText: { fontSize: 13, color: COLORS.text },
  szListTextActive: { fontWeight: 'bold', color: COLORS.primary },

  rightPanel: { flex: 1, padding: 16 },
  contentTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  contentSubtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 20 },

  progressCard: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 8, elevation: 1, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  inputCard: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 8, elevation: 1, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginBottom: 12 },
  
  input: { width: '100%', height: 80, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, padding: 12, color: COLORS.text, textAlignVertical: 'top', marginBottom: 12 },
  button: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 4, alignItems: 'center' },
  buttonText: { color: COLORS.surface, fontWeight: 'bold' },

  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 12, marginTop: 8 },

  historyCard: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 8, marginBottom: 12, elevation: 1, borderWidth: 1, borderColor: COLORS.border },
  historyText: { fontSize: 14, color: COLORS.text, marginBottom: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  metaText: { fontSize: 11, color: COLORS.textMuted }
});
