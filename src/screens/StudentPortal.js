import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';
import { useAppState } from '../context/AppStateContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { zonesData, getSubZonesForZone } from '../data/zones';
import { launchCamera } from 'react-native-image-picker';

export default function StudentPortal({ route, navigation }) {
  const { loginId } = route.params || {};
  const { addComplaint, complaints } = useAppState();
  
  const [activeTab, setActiveTab] = useState('NewConcern');
  const [description, setDescription] = useState('');
  const [selectedZone, setSelectedZone] = useState('zone_1');
  const [selectedSubZone, setSelectedSubZone] = useState('');
  const [photoUri, setPhotoUri] = useState(null);

  const myConcerns = complaints.filter(c => c.reportedBy === (loginId || 'student_unknown'));

  const handleCapturePhoto = async () => {
    Alert.alert(
      "Camera Access",
      "Camera access is compulsory to capture and submit a concern.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Open Camera", 
          onPress: async () => {
             const result = await launchCamera({ mediaType: 'photo', cameraType: 'back' });
             if (!result.didCancel && !result.errorCode && result.assets) {
               setPhotoUri(result.assets[0].uri);
             }
          }
        }
      ]
    );
  };

  const handleSubmit = () => {
    if (!description.trim() || !selectedSubZone) {
       alert("Please fill description and select a sub-zone.");
       return;
    }
    if (!photoUri) {
       alert("Photo proof is COMPULSORY. Please tap 'Capture Photo Evidence' to take a photo of the concern.");
       return;
    }
    
    addComplaint({
      description,
      zone: selectedZone,
      subZone: selectedSubZone,
      reportedBy: loginId || 'student_unknown',
      reportedAt: new Date().toLocaleString(),
      status: 'open',
      photoUri: photoUri
    });
    
    setDescription('');
    setPhotoUri(null);
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

      <Text style={styles.label}>Compulsory Photo Evidence</Text>
      {photoUri ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: photoUri }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.retakeButton} onPress={handleCapturePhoto}>
            <Text style={styles.retakeButtonText}>Retake Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.mockUpload} onPress={handleCapturePhoto}>
          <Text style={styles.mockUploadText}>+ Capture Photo Evidence (Required)</Text>
        </TouchableOpacity>
      )}

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
          {c.photoUri && <Image source={{ uri: c.photoUri }} style={styles.imagePreview} />}
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
                 <Text style={{fontSize: 12, color: COLORS.text}}>Sub-Zonal Remark: "Issue has been resolved."</Text>
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
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderColor: COLORS.border },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  logoutBtn: { backgroundColor: COLORS.primaryDim, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4, alignSelf: 'center' },
  logoutText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },

  tabsRow: { flexDirection: 'row', backgroundColor: COLORS.surface, borderBottomWidth: 1, borderColor: COLORS.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: COLORS.primary },
  tabText: { color: COLORS.textMuted, fontWeight: 'bold' },
  tabTextActive: { color: COLORS.primary },

  scroll: { padding: 16 },

  card: { backgroundColor: COLORS.surface, padding: 20, borderRadius: 8, elevation: 1, borderWidth: 1, borderColor: COLORS.border },
  label: { fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 8, marginTop: 16 },
  
  filterRow: { flexDirection: 'row', marginBottom: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, marginRight: 8, height: 32 },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { fontSize: 12, color: COLORS.textMuted },
  filterChipTextActive: { color: COLORS.surface, fontWeight: 'bold' },

  input: { width: '100%', backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, paddingHorizontal: 16, fontSize: 14, color: COLORS.text },
  textArea: { paddingTop: 16, height: 100, textAlignVertical: 'top' },

  mockUpload: { width: '100%', height: 80, borderWidth: 2, borderColor: COLORS.primaryDim, borderStyle: 'dashed', borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 24, backgroundColor: COLORS.background },
  mockUploadText: { color: COLORS.primary, fontWeight: 'bold' },
  
  imagePreviewContainer: { marginBottom: 24, marginTop: 8 },
  imagePreview: { width: '100%', height: 150, borderRadius: 8, backgroundColor: '#eee', marginBottom: 8 },
  retakeButton: { alignSelf: 'flex-start', padding: 8, backgroundColor: COLORS.primaryDim, borderRadius: 4 },
  retakeButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },

  button: { width: '100%', height: 45, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  buttonText: { color: COLORS.surface, fontSize: 16, fontWeight: 'bold' },

  historyCard: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 8, marginBottom: 12, elevation: 1, borderWidth: 1, borderColor: COLORS.border },
  historyText: { fontSize: 14, color: COLORS.text, marginBottom: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  metaText: { fontSize: 11, color: COLORS.textMuted },
  statusBox: { borderTopWidth: 1, borderColor: COLORS.border, paddingTop: 8, marginTop: 4 },
  emptyText: { textAlign: 'center', color: COLORS.textMuted, marginTop: 20 }
});
