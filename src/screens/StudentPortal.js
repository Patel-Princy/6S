import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';
import { useAppState } from '../context/AppStateContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { zonesData, getSubZonesForZone } from '../data/zones';

export default function StudentPortal({ route, navigation }) {
  const { loginId } = route.params || {};
  const { addComplaint, complaints } = useAppState();
  
  const [activeTab, setActiveTab] = useState('NewConcern');
  const [description, setDescription] = useState('');
  const [selectedZone, setSelectedZone] = useState('zone_1');
  const [selectedSubZone, setSelectedSubZone] = useState('');

  const myConcerns = complaints.filter(c => c.reportedBy === (loginId || 'student_unknown'));

  const handleSubmit = () => {
    if (!description.trim() || !selectedSubZone) {
       alert("Please fill description and select a sub-zone");
       return;
    }
    
    addComplaint({
      description,
      zone: selectedZone,
      subZone: selectedSubZone,
      reportedBy: loginId || 'student_unknown',
      reportedAt: new Date().toLocaleString(),
      status: 'open'
    });
    
    setDescription('');
    alert('Issue reported successfully!');
    setActiveTab('MyConcerns');
  };

  const renderNewConcern = () => (
    <View style={styles.card}>
      <Text style={styles.label}>Select Zone</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {zonesData.map(z => (
          <TouchableOpacity key={z.id} onPress={() => { setSelectedZone(z.id); setSelectedSubZone(''); }} style={[styles.filterChip, selectedZone === z.id && styles.filterChipActive]}>
            <Text style={[styles.filterChipText, selectedZone === z.id && styles.filterChipTextActive]}>Zone {z.id.split('_')[1]}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Select Sub-Zone</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {getSubZonesForZone(selectedZone).map(sz => (
          <TouchableOpacity key={sz.id} onPress={() => setSelectedSubZone(sz.id)} style={[styles.filterChip, selectedSubZone === sz.id && styles.filterChipActive]}>
            <Text style={[styles.filterChipText, selectedSubZone === sz.id && styles.filterChipTextActive]}>{sz.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Issue Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the issue in detail..."
        placeholderTextColor={COLORS.textMuted}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.mockUpload}>
        <Text style={styles.mockUploadText}>+ Upload Photo Evidence</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Report</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMyConcerns = () => (
    <View style={{ flex: 1 }}>
      {myConcerns.length === 0 ? <Text style={styles.emptyText}>No concerns raised yet.</Text> : null}
      {myConcerns.map((c, i) => (
        <View key={i} style={styles.historyCard}>
          <Text style={styles.historyText}>{c.description}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Zone: {c.zone} | Sub: {c.subZone}</Text>
            <Text style={styles.metaText}>Time: {c.reportedAt}</Text>
          </View>
          
          <View style={styles.statusBox}>
            <Text style={{fontSize: 12, fontWeight: 'bold', color: c.status === 'open' ? COLORS.warning : COLORS.success}}>
              Status: {c.status.toUpperCase()}
            </Text>
            {c.status !== 'open' && (
              <View style={{marginTop: 8}}>
                 <Text style={{fontSize: 12, color: COLORS.text}}>Sub-Zonal Remark: "Issue has been resolved and cleaned."</Text>
                 <View style={styles.mockPhotoProof}>
                   <Text style={{fontSize: 10, color: COLORS.textMuted}}>Photo Proof Attached</Text>
                 </View>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Student Portal</Text>
          <Text style={styles.subtitle}>Level 1 - Issue Reporting</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsRow}>
        <TouchableOpacity style={[styles.tab, activeTab === 'NewConcern' && styles.tabActive]} onPress={() => setActiveTab('NewConcern')}>
          <Text style={[styles.tabText, activeTab === 'NewConcern' && styles.tabTextActive]}>New Concern</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'MyConcerns' && styles.tabActive]} onPress={() => setActiveTab('MyConcerns')}>
          <Text style={[styles.tabText, activeTab === 'MyConcerns' && styles.tabTextActive]}>My Concerns</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {activeTab === 'NewConcern' ? renderNewConcern() : renderMyConcerns()}
      </ScrollView>
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

  scroll: { padding: 16 },

  card: { backgroundColor: '#fff', padding: 20, borderRadius: 8, elevation: 1 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#2f3640', marginBottom: 8, marginTop: 16 },
  
  filterRow: { flexDirection: 'row', marginBottom: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#bdc3c7', marginRight: 8, height: 32 },
  filterChipActive: { backgroundColor: '#3498db', borderColor: '#3498db' },
  filterChipText: { fontSize: 12, color: '#7f8c8d' },
  filterChipTextActive: { color: '#fff', fontWeight: 'bold' },

  input: { width: '100%', backgroundColor: '#f5f6fa', borderWidth: 1, borderColor: '#dcdde1', borderRadius: 4, paddingHorizontal: 16, fontSize: 14, color: '#2f3640' },
  textArea: { paddingTop: 16, height: 100, textAlignVertical: 'top' },

  mockUpload: { width: '100%', height: 80, borderWidth: 2, borderColor: '#bdc3c7', borderStyle: 'dashed', borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 24, backgroundColor: '#f5f6fa' },
  mockUploadText: { color: '#7f8c8d', fontWeight: 'bold' },
  
  button: { width: '100%', height: 45, backgroundColor: '#3498db', justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  historyCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 1 },
  historyText: { fontSize: 14, color: '#2f3640', marginBottom: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  metaText: { fontSize: 11, color: '#7f8fa6' },
  statusBox: { borderTopWidth: 1, borderColor: '#ecf0f1', paddingTop: 8, marginTop: 4 },
  mockPhotoProof: { width: 60, height: 60, backgroundColor: '#ecf0f1', justifyContent: 'center', alignItems: 'center', marginTop: 8, borderRadius: 4 },
  emptyText: { textAlign: 'center', color: '#7f8fa6', marginTop: 20 }
});
