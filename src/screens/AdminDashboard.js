import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Dimensions } from 'react-native';
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

  // Simple mock metrics
  const totalChecklists = 4;
  const zonalReviews = 3;
  const studentIssues = complaints.length;
  const overallCompliance = '12.5%';

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  const barData = {
    labels: zonesData.map(z => z.name.split('–')[1] || z.name).slice(0,4), // abbreviated for mobile
    datasets: [
      {
        data: [2, 1, 1, 0] // mock data
      }
    ]
  };

  const pieData = [
    { name: 'Green', population: 50, color: '#2ecc71', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Yellow', population: 25, color: '#f1c40f', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Red', population: 25, color: '#e74c3c', legendFontColor: '#7F7F7F', legendFontSize: 12 },
  ];

  const handlePublish = () => {
    alert(`Advisory Published to ${selectedZone !== 'All' ? selectedZone : 'All Zones'} - ${selectedSubZone !== 'All' ? selectedSubZone : 'All Sub-zones'}`);
    setAdvisory('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Top Header */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.sysTitle}>6S Management System</Text>
            <Text style={styles.sysSub}>University Campus</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Level 4 - Admin</Text>
            <TouchableOpacity onPress={() => navigation.replace('LoginScreen')} style={styles.logoutBtn}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.title}>Admin Dashboard - Core Committee</Text>
        <Text style={styles.subtitle}>Master Compliance View</Text>

        {/* Top Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsRow}>
          <View style={[styles.statCard, { backgroundColor: '#3498db' }]}>
            <Text style={styles.statLabel}>Total Checklists</Text>
            <Text style={styles.statValue}>{totalChecklists}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#9b59b6' }]}>
            <Text style={styles.statLabel}>Zonal Reviews</Text>
            <Text style={styles.statValue}>{zonalReviews}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#e67e22' }]}>
            <Text style={styles.statLabel}>Student Issues</Text>
            <Text style={styles.statValue}>{studentIssues}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#2ecc71' }]}>
            <Text style={styles.statLabel}>Overall Compliance</Text>
            <Text style={styles.statValue}>{overallCompliance}</Text>
          </View>
        </ScrollView>

        {/* Advisory Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Global Review/Advisory</Text>
          
          <Text style={styles.label}>Target Zone:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            <TouchableOpacity onPress={() => { setSelectedZone('All'); setSelectedSubZone('All'); }} style={[styles.filterChip, selectedZone === 'All' && styles.filterChipActive]}>
              <Text style={[styles.filterChipText, selectedZone === 'All' && styles.filterChipTextActive]}>All Zones</Text>
            </TouchableOpacity>
            {zonesData.map(z => (
              <TouchableOpacity key={z.id} onPress={() => { setSelectedZone(z.id); setSelectedSubZone('All'); }} style={[styles.filterChip, selectedZone === z.id && styles.filterChipActive]}>
                <Text style={[styles.filterChipText, selectedZone === z.id && styles.filterChipTextActive]}>Zone {z.id.split('_')[1]}</Text>
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

        {/* 6S Analysis Charts */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Compliance Status by Zone</Text>
          <BarChart
            data={barData}
            width={screenWidth - 80}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overall Status Distribution</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 80}
            height={200}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        </View>

        {/* Zone-wise Details Table */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Zone-wise Details</Text>
          {zonesData.map(z => (
            <View key={z.id} style={styles.tableRow}>
              <View style={{flex: 1}}>
                <Text style={styles.tableHeader}>{z.name.split('–')[1]}</Text>
                <Text style={styles.tableSub}>Zone {z.id.split('_')[1]}</Text>
              </View>
              <Text style={{flex: 1, fontSize: 10, color: COLORS.textMuted}}>{z.head}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scroll: { padding: 16 },
  
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sysTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  sysSub: { fontSize: 12, color: '#7f8c8d' },
  userInfo: { alignItems: 'flex-end' },
  userName: { fontSize: 12, color: '#e67e22', fontWeight: 'bold', marginBottom: 4 },
  logoutBtn: { backgroundColor: '#ffeaa7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 },
  logoutText: { color: '#d35400', fontSize: 12, fontWeight: 'bold' },

  title: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#7f8c8d', marginBottom: 20 },

  cardsRow: { flexDirection: 'row', marginBottom: 20 },
  statCard: { width: 140, padding: 16, borderRadius: 8, marginRight: 12, justifyContent: 'center' },
  statLabel: { color: '#fff', fontSize: 12, opacity: 0.9, marginBottom: 8 },
  statValue: { color: '#fff', fontSize: 24, fontWeight: 'bold' },

  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 20, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 16 },

  label: { fontSize: 12, color: '#7f8c8d', marginBottom: 8 },
  filterRow: { flexDirection: 'row', marginBottom: 16 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#bdc3c7', marginRight: 8 },
  filterChipActive: { backgroundColor: '#3498db', borderColor: '#3498db' },
  filterChipText: { fontSize: 12, color: '#7f8c8d' },
  filterChipTextActive: { color: '#fff', fontWeight: 'bold' },

  input: { width: '100%', height: 100, backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#bdc3c7', borderRadius: 4, padding: 12, fontSize: 14, textAlignVertical: 'top', marginBottom: 16 },
  button: { width: '100%', height: 45, backgroundColor: '#bdc3c7', justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ecf0f1', paddingVertical: 12, alignItems: 'center' },
  tableHeader: { fontSize: 12, fontWeight: 'bold', color: '#2c3e50' },
  tableSub: { fontSize: 10, color: '#7f8c8d' }
});
