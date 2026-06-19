import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, FlatList } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';
import { useAppState } from '../context/AppStateContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { zonesData, getSubZonesForZone } from '../data/zones';

export default function ZonalDashboard({ route, navigation }) {
  const { loginId } = route.params || {};
  const { checklists, complaints } = useAppState();
  
  // Default to Zone 1 if loginId doesn't specify
  const [zoneId, setZoneId] = useState('zone_1');
  const [zoneDetails, setZoneDetails] = useState(null);
  
  const [activeTab, setActiveTab] = useState('SubZonalLogs'); // SubZonalLogs, CommitRemarks, ZoneConcerns
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
    if (activeTab === 'SubZonalLogs') {
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
    }
    return (
      <View style={styles.leftPanel}>
        <Text style={styles.panelTitle}>Menu</Text>
        <TouchableOpacity style={[styles.szListItem, activeTab === 'CommitRemarks' && styles.szListItemActive]} onPress={() => setActiveTab('CommitRemarks')}>
           <Text style={[styles.szListText, activeTab === 'CommitRemarks' && styles.szListTextActive]}>Commit Remarks Log</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.szListItem, activeTab === 'ZoneConcerns' && styles.szListItemActive]} onPress={() => setActiveTab('ZoneConcerns')}>
           <Text style={[styles.szListText, activeTab === 'ZoneConcerns' && styles.szListTextActive]}>Zone Concerns</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderRightPanel = () => {
    if (activeTab === 'SubZonalLogs' && selectedSubZone) {
      return (
        <ScrollView style={styles.rightPanel}>
          <Text style={styles.contentTitle}>{selectedSubZone.name}</Text>
          <Text style={styles.contentSubtitle}>Coordinator: {selectedSubZone.coordinator}</Text>

          <View style={styles.progressCard}>
            <Text style={styles.cardHeader}>Progress Report</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10}}>
              <Text>Overall Status:</Text>
              <Text style={{color: COLORS.success, fontWeight: 'bold'}}>Good</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>Compliance Progress:</Text>
              <Text style={{fontWeight: 'bold'}}>85%</Text>
            </View>
          </View>

          <View style={styles.inputCard}>
             <Text style={styles.cardHeader}>Commit Remark</Text>
             <TextInput
                style={styles.input}
                value={remark}
                onChangeText={setRemark}
                placeholder={`Write remark for ${selectedSubZone.name}...`}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity style={styles.button} onPress={handleDispatchRemark}>
                <Text style={styles.buttonText}>Dispatch Remark</Text>
              </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    if (activeTab === 'CommitRemarks') {
      return (
        <ScrollView style={styles.rightPanel}>
          <Text style={styles.contentTitle}>Commit Remarks Log</Text>
          {remarksHistory.map(r => (
            <View key={r.id} style={styles.historyCard}>
              <Text style={styles.historyText}>{r.text}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>By: {r.by}</Text>
                <Text style={styles.metaText}>Time: {r.timestamp}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>Sub-Zone: {zoneDetails?.subZones.find(s => s.id === r.subZone)?.name || r.subZone}</Text>
                <Text style={styles.metaText}>Action Taken: {r.actionTime}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      );
    }

    if (activeTab === 'ZoneConcerns') {
      const openConcerns = complaints.filter(c => c.status === 'open'); // mock filtering
      return (
        <ScrollView style={styles.rightPanel}>
          <Text style={styles.contentTitle}>Zone Concerns (From Students)</Text>
          {openConcerns.length === 0 ? <Text>No open concerns for this zone.</Text> : null}
          {openConcerns.map((c, i) => (
             <View key={i} style={styles.historyCard}>
               <Text style={styles.historyText}>{c.description}</Text>
               <View style={styles.metaRow}>
                 <Text style={styles.metaText}>Raised By: Level 1 (Student)</Text>
                 <Text style={styles.metaText}>Time: {c.reportedAt || 'Just now'}</Text>
               </View>
               <View style={styles.metaRow}>
                 <Text style={styles.metaText}>Sub-Zone: {c.subZone || 'Not specified'}</Text>
                 <Text style={styles.metaText}>Status: {c.status}</Text>
               </View>
             </View>
          ))}
        </ScrollView>
      );
    }

    return <View style={styles.rightPanel}><Text>Select an option</Text></View>;
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

      <View style={styles.tabsRow}>
        <TouchableOpacity style={[styles.tab, activeTab === 'SubZonalLogs' && styles.tabActive]} onPress={() => setActiveTab('SubZonalLogs')}>
          <Text style={[styles.tabText, activeTab === 'SubZonalLogs' && styles.tabTextActive]}>Sub-Zonal Logs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'CommitRemarks' && styles.tabActive]} onPress={() => setActiveTab('CommitRemarks')}>
          <Text style={[styles.tabText, activeTab === 'CommitRemarks' && styles.tabTextActive]}>Commit Remarks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'ZoneConcerns' && styles.tabActive]} onPress={() => setActiveTab('ZoneConcerns')}>
          <Text style={[styles.tabText, activeTab === 'ZoneConcerns' && styles.tabTextActive]}>Zone Concerns</Text>
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
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dcdde1' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2f3640' },
  subtitle: { fontSize: 14, color: '#7f8fa6', marginTop: 4 },
  logoutBtn: { backgroundColor: '#ffeaa7', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4, alignSelf: 'center' },
  logoutText: { color: '#d35400', fontSize: 12, fontWeight: 'bold' },

  tabsRow: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dcdde1' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#3498db' },
  tabText: { color: '#7f8fa6', fontWeight: 'bold' },
  tabTextActive: { color: '#3498db' },

  mainContent: { flex: 1, flexDirection: 'row' },
  
  leftPanel: { width: '30%', backgroundColor: '#fff', borderRightWidth: 1, borderColor: '#dcdde1', paddingVertical: 10 },
  panelTitle: { fontSize: 14, fontWeight: 'bold', color: '#2f3640', marginLeft: 16, marginBottom: 10, textTransform: 'uppercase' },
  szListItem: { padding: 12, paddingLeft: 16, borderBottomWidth: 1, borderColor: '#f5f6fa' },
  szListItemActive: { backgroundColor: '#e1f5fe', borderRightWidth: 4, borderColor: '#3498db' },
  szListText: { fontSize: 13, color: '#2f3640' },
  szListTextActive: { fontWeight: 'bold', color: '#2980b9' },

  rightPanel: { flex: 1, padding: 16 },
  contentTitle: { fontSize: 22, fontWeight: 'bold', color: '#2f3640', marginBottom: 4 },
  contentSubtitle: { fontSize: 14, color: '#7f8fa6', marginBottom: 20 },

  progressCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, elevation: 1, marginBottom: 16 },
  inputCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, elevation: 1 },
  cardHeader: { fontSize: 16, fontWeight: 'bold', color: '#2f3640', marginBottom: 12 },
  
  input: { width: '100%', height: 80, backgroundColor: '#f5f6fa', borderWidth: 1, borderColor: '#dcdde1', borderRadius: 4, padding: 12, textAlignVertical: 'top', marginBottom: 12 },
  button: { backgroundColor: '#3498db', padding: 12, borderRadius: 4, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },

  historyCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 1 },
  historyText: { fontSize: 14, color: '#2f3640', marginBottom: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  metaText: { fontSize: 11, color: '#7f8fa6' }
});
