import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, Image } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';
import { useAppState } from '../context/AppStateContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { zonesData } from '../data/zones';
import { launchCamera } from 'react-native-image-picker';

export default function SubZonalDashboard({ route, navigation }) {
  const { loginId } = route.params || {};
  const { checklists, addChecklist, complaints } = useAppState();
  
  const subZoneInfo = zonesData[0].subZones[0]; // Mock
  
  const [activeTab, setActiveTab] = useState('DailyChecklist');
  const [remark, setRemark] = useState('');
  const [resolvedConcerns, setResolvedConcerns] = useState([]);

  const handleResolveConcern = async (concernId) => {
    if (!remark) {
      alert("Please add a comment to notify the user.");
      return;
    }
    
    // Simulate camera request
    Alert.alert(
      "Photo Proof Required",
      "Please capture a photo to prove the concern is resolved.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Open Camera", 
          onPress: async () => {
             const result = await launchCamera({ mediaType: 'photo', cameraType: 'back' });
             if (!result.didCancel && !result.errorCode) {
               setResolvedConcerns([...resolvedConcerns, { id: concernId, remark, photo: result.assets[0].uri, timestamp: new Date().toLocaleString() }]);
               alert('Concern resolved successfully!');
               setRemark('');
             } else {
               alert('Photo capture cancelled. Proof is compulsory.');
             }
          }
        }
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
      const openConcerns = complaints.filter(c => c.status === 'open' && !resolvedConcerns.find(r => r.id === c.id));
      return (
        <ScrollView style={styles.rightPanel}>
          <Text style={styles.contentTitle}>Pending Floor Concerns</Text>
          <Text style={styles.contentSubtitle}>Address issues raised by students.</Text>
          {openConcerns.length === 0 ? <Text style={{color: COLORS.textMuted}}>No pending concerns.</Text> : null}
          {openConcerns.map((c, i) => (
             <View key={c.id || i} style={styles.historyCard}>
               <Text style={styles.historyText}>{c.description}</Text>
               {c.photoUri && <Image source={{uri: c.photoUri}} style={styles.concernImage} />}
               <Text style={styles.metaText}>Raised: {c.reportedAt || 'Today'}</Text>
               
               <View style={styles.resolveBox}>
                  <TextInput
                    style={styles.input}
                    value={remark}
                    onChangeText={setRemark}
                    placeholder="Add comments to notify the user..."
                    placeholderTextColor={COLORS.textMuted}
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
      return (
        <ScrollView style={styles.rightPanel}>
          <Text style={styles.contentTitle}>Resolved Concerns History</Text>
          {resolvedConcerns.length === 0 ? <Text style={{color: COLORS.textMuted}}>No resolved concerns yet.</Text> : null}
          {resolvedConcerns.map((r, i) => (
             <View key={i} style={styles.historyCard}>
               <Text style={styles.historyText}>Resolution Comment: {r.remark}</Text>
               {r.photo && <Image source={{uri: r.photo}} style={styles.concernImage} />}
               <View style={styles.metaRow}>
                 <Text style={styles.metaText}>Action: Resolved with photo</Text>
                 <Text style={styles.metaText}>Time: {r.timestamp}</Text>
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
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderColor: COLORS.border },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  logoutBtn: { backgroundColor: COLORS.primaryDim, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4, alignSelf: 'center' },
  logoutText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },

  mainContent: { flex: 1, flexDirection: 'row' },
  
  leftPanel: { width: '30%', backgroundColor: COLORS.surface, borderRightWidth: 1, borderColor: COLORS.border, paddingVertical: 10 },
  panelTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginLeft: 16, marginBottom: 10, textTransform: 'uppercase' },
  szListItem: { padding: 12, paddingLeft: 16, borderBottomWidth: 1, borderColor: COLORS.border },
  szListItemActive: { backgroundColor: COLORS.primaryDim, borderRightWidth: 4, borderColor: COLORS.primary },
  szListText: { fontSize: 13, color: COLORS.text },
  szListTextActive: { fontWeight: 'bold', color: COLORS.primary },

  rightPanel: { flex: 1, padding: 16 },
  contentTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  contentSubtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 20 },

  card: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 8, elevation: 1, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginBottom: 12 },
  
  button: { backgroundColor: COLORS.success, padding: 12, borderRadius: 4, alignItems: 'center' },
  buttonText: { color: COLORS.surface, fontWeight: 'bold' },

  historyCard: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 8, marginBottom: 12, elevation: 1, borderWidth: 1, borderColor: COLORS.border },
  historyText: { fontSize: 14, color: COLORS.text, marginBottom: 8 },
  historyDate: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  historyStatus: { fontSize: 12, color: COLORS.success, marginTop: 4 },
  
  concernImage: { width: '100%', height: 150, borderRadius: 8, marginVertical: 8, backgroundColor: '#eee' },

  resolveBox: { marginTop: 12, borderTopWidth: 1, borderColor: COLORS.border, paddingTop: 12 },
  input: { width: '100%', height: 40, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, paddingHorizontal: 12, marginBottom: 8, color: COLORS.text },
  resolveBtn: { backgroundColor: COLORS.primary, padding: 10, borderRadius: 4, alignItems: 'center' },
  resolveBtnText: { color: COLORS.surface, fontWeight: 'bold', fontSize: 12 },

  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  metaText: { fontSize: 11, color: COLORS.textMuted }
});
