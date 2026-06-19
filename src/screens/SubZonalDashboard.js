import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';
import { useAppState } from '../context/AppStateContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { zonesData } from '../data/zones';

export default function SubZonalDashboard({ route, navigation }) {
  const { loginId } = route.params || {};
  const { checklists, addChecklist, complaints } = useAppState();
  
  // Mock logged in sub-zone
  const subZoneInfo = zonesData[0].subZones[0]; // "Anviksha Ground Floor"
  
  const [activeTab, setActiveTab] = useState('DailyChecklist');
  const [remark, setRemark] = useState('');

  // Mock states for concerns
  const [resolvedConcerns, setResolvedConcerns] = useState([]);

  const handleResolveConcern = (concernId) => {
    // In real app, we would upload to Firebase Storage, get URI, then update Firestore
    Alert.alert(
      "Upload Photo Proof",
      "Choose a photo to upload for resolving this concern",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Upload & Resolve", onPress: () => {
           setResolvedConcerns([...resolvedConcerns, concernId]);
           alert('Concern resolved with photo proof and remark!');
           setRemark('');
        }}
      ]
    );
  };

  const submitTodayChecklist = () => {
    addChecklist({
      zone: 1,
      subZone: subZoneInfo.id,
      items: ['Sort', 'Set in order', 'Shine', 'Standardize', 'Sustain', 'Safety'],
    });
    alert('6S Checklist Submitted for Today!');
  };

  const renderLeftPanel = () => (
    <View style={styles.leftPanel}>
      <Text style={styles.panelTitle}>Menu</Text>
      <TouchableOpacity style={[styles.szListItem, activeTab === 'DailyChecklist' && styles.szListItemActive]} onPress={() => setActiveTab('DailyChecklist')}>
         <Text style={[styles.szListText, activeTab === 'DailyChecklist' && styles.szListTextActive]}>Daily Checklist</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.szListItem, activeTab === 'FloorConcerns' && styles.szListItemActive]} onPress={() => setActiveTab('FloorConcerns')}>
         <Text style={[styles.szListText, activeTab === 'FloorConcerns' && styles.szListTextActive]}>Floor Concerns</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.szListItem, activeTab === 'History' && styles.szListItemActive]} onPress={() => setActiveTab('History')}>
         <Text style={[styles.szListText, activeTab === 'History' && styles.szListTextActive]}>Checklist History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.szListItem, activeTab === 'ConcernsHistory' && styles.szListItemActive]} onPress={() => setActiveTab('ConcernsHistory')}>
         <Text style={[styles.szListText, activeTab === 'ConcernsHistory' && styles.szListTextActive]}>Concerns History</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRightPanel = () => {
    if (activeTab === 'DailyChecklist') {
      return (
        <ScrollView style={styles.rightPanel}>
          <Text style={styles.contentTitle}>6S Digital Checklist</Text>
          <Text style={styles.contentSubtitle}>Ensure all 6S parameters are met for your designated area.</Text>
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Submit Today's Log</Text>
            <TouchableOpacity style={styles.button} onPress={submitTodayChecklist}>
              <Text style={styles.buttonText}>Submit Daily 6S Log</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    if (activeTab === 'FloorConcerns') {
      const openConcerns = complaints.filter(c => c.status === 'open' && !resolvedConcerns.includes(c.id));
      return (
        <ScrollView style={styles.rightPanel}>
          <Text style={styles.contentTitle}>Pending Floor Concerns</Text>
          <Text style={styles.contentSubtitle}>Address issues raised by students.</Text>
          {openConcerns.length === 0 ? <Text>No pending concerns.</Text> : null}
          {openConcerns.map((c, i) => (
             <View key={i} style={styles.historyCard}>
               <Text style={styles.historyText}>{c.description}</Text>
               <Text style={styles.metaText}>Raised: {c.reportedAt || 'Today'}</Text>
               
               <View style={styles.resolveBox}>
                  <TextInput
                    style={styles.input}
                    value={remark}
                    onChangeText={setRemark}
                    placeholder="Add comments to notify the user..."
                  />
                  <TouchableOpacity style={styles.resolveBtn} onPress={() => handleResolveConcern(c.id || i)}>
                    <Text style={styles.resolveBtnText}>Resolve & Upload Photo</Text>
                  </TouchableOpacity>
               </View>
             </View>
          ))}
        </ScrollView>
      );
    }

    if (activeTab === 'History') {
      return (
        <ScrollView style={styles.rightPanel}>
          <Text style={styles.contentTitle}>Submission History</Text>
          {checklists.map((item, index) => (
            <View key={index} style={styles.historyCard}>
              <Text style={styles.historyDate}>{new Date(item.submittedAt).toLocaleString()}</Text>
              <Text style={styles.historyStatus}>Status: {item.status.toUpperCase()}</Text>
            </View>
          ))}
        </ScrollView>
      );
    }

    if (activeTab === 'ConcernsHistory') {
      const resolved = complaints.filter(c => resolvedConcerns.includes(c.id));
      return (
        <ScrollView style={styles.rightPanel}>
          <Text style={styles.contentTitle}>Resolved Concerns History</Text>
          {resolved.length === 0 ? <Text>No resolved concerns yet.</Text> : null}
          {resolved.map((c, i) => (
             <View key={i} style={styles.historyCard}>
               <Text style={styles.historyText}>{c.description}</Text>
               <View style={styles.metaRow}>
                 <Text style={styles.metaText}>Action: Resolved with photo</Text>
                 <Text style={styles.metaText}>Time: {new Date().toLocaleString()}</Text>
               </View>
             </View>
          ))}
        </ScrollView>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
           <Text style={styles.title}>Sub-Zonal Head</Text>
           <Text style={styles.subtitle}>{subZoneInfo.name} - {subZoneInfo.coordinator}</Text>
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
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dcdde1' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2f3640' },
  subtitle: { fontSize: 14, color: '#7f8fa6', marginTop: 4 },
  logoutBtn: { backgroundColor: '#ffeaa7', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4, alignSelf: 'center' },
  logoutText: { color: '#d35400', fontSize: 12, fontWeight: 'bold' },

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

  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, elevation: 1, marginBottom: 16 },
  cardHeader: { fontSize: 16, fontWeight: 'bold', color: '#2f3640', marginBottom: 12 },
  
  button: { backgroundColor: '#2ecc71', padding: 12, borderRadius: 4, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },

  historyCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 1 },
  historyText: { fontSize: 14, color: '#2f3640', marginBottom: 8 },
  historyDate: { fontSize: 14, fontWeight: '600', color: '#2f3640' },
  historyStatus: { fontSize: 12, color: '#2ecc71', marginTop: 4 },
  
  resolveBox: { marginTop: 12, borderTopWidth: 1, borderColor: '#ecf0f1', paddingTop: 12 },
  input: { width: '100%', height: 40, backgroundColor: '#f5f6fa', borderWidth: 1, borderColor: '#dcdde1', borderRadius: 4, paddingHorizontal: 12, marginBottom: 8 },
  resolveBtn: { backgroundColor: '#3498db', padding: 10, borderRadius: 4, alignItems: 'center' },
  resolveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  metaText: { fontSize: 11, color: '#7f8fa6' }
});
