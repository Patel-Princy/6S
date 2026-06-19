import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';

export default function LoginScreen({ navigation }) {
  const [loginId, setLoginId] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!loginId.trim()) {
      setError('Please enter a valid Login ID.');
      return;
    }

    const id = loginId.trim().toLowerCase();

    if (id.startsWith('admin_')) {
      navigation.replace('AdminDashboard');
    } else if (id.startsWith('zone')) {
      navigation.replace('ZonalDashboard', { loginId: id });
    } else if (id.startsWith('sub_')) {
      navigation.replace('SubZonalDashboard', { loginId: id });
    } else if (id.startsWith('student_')) {
      navigation.replace('StudentPortal', { loginId: id });
    } else {
      // Fallback
      navigation.replace('StudentPortal', { loginId: id });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.title}>GSFCU 5S Monitor</Text>
        <Text style={styles.subtitle}>Campus Compliance System</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Login ID (e.g. admin_mahesh)"
          placeholderTextColor={COLORS.textMuted}
          value={loginId}
          onChangeText={(text) => {
            setLoginId(text);
            setError('');
          }}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.surface,
    padding: 24,
    borderRadius: 24,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.secondary,
    marginBottom: 32,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.error,
    alignSelf: 'flex-start',
    marginBottom: 16,
    fontSize: 14,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.radiusSm,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
