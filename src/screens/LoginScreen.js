import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Image,
  Dimensions,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { COLORS } from '../theme/theme';
import Svg, { Path, Circle, Line, Polyline } from 'react-native-svg';

const { width } = Dimensions.get('window');

// SVG Icons
const EyeIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></Path>
    <Circle cx="12" cy="12" r="3"></Circle>
  </Svg>
);

const EyeOffIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></Path>
    <Line x1="1" y1="1" x2="23" y2="23"></Line>
  </Svg>
);

const ArrowRightIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="5" y1="12" x2="19" y2="12"></Line>
    <Polyline points="12 5 19 12 12 19"></Polyline>
  </Svg>
);

const GoogleIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    <Path d="M1 1h22v22H1z" fill="none" />
  </Svg>
);

export default function LoginScreen({ navigation }) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!loginId.trim()) {
      setError('Please enter a valid Email Address.');
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Top right decoration circle */}
          <View style={styles.topDecoration} />
          {/* Left decoration circle */}
          <View style={styles.leftDecoration} />

          {/* Main Content */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../photo/logo.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
          </View>
          
          <View style={styles.headerContainer}>
            <Text style={styles.title}>6S Campus Monitor</Text>
            <Text style={styles.subtitle}>Welcome 👋</Text>
          </View>

          {/* Card */}
          <View style={styles.cardWrapper}>
            <View style={styles.card}>
              <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
                  <Text style={styles.activeTabText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton}>
                  <Text style={styles.inactiveTabText}>Sign up</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#A0A0A0"
                  value={loginId}
                  onChangeText={(text) => {
                    setLoginId(text);
                    setError('');
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { paddingRight: 50 }]}
                  placeholder="Password"
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </TouchableOpacity>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Circular submit button centered at the bottom edge of the card */}
            <View style={styles.submitButtonContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
                <ArrowRightIcon />
              </TouchableOpacity>
            </View>
          </View>

          {/* OR Divider */}
          <View style={styles.orContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Button */}
          <TouchableOpacity style={styles.googleButton}>
            <GoogleIcon />
          </TouchableOpacity>

          {/* Bottom Background Sketches */}
          <View style={styles.bottomSketchContainer}>
            <Image 
              source={require('../../photo/rb.jpeg')} 
              style={styles.bottomSketchLeft} 
              resizeMode="contain"
            />
            <Image 
              source={require('../../photo/lb.jpeg')} 
              style={styles.bottomSketchRight} 
              resizeMode="contain"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Off-white background
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  topDecoration: {
    position: 'absolute',
    top: -80,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 40,
    borderColor: '#E6D5D6', // Pale pinkish/maroon color
    opacity: 0.6,
  },
  leftDecoration: {
    position: 'absolute',
    top: '40%',
    left: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6D5D6',
    opacity: 0.8,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 50,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 30,
    marginTop: 10,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1C0A0E',
    marginBottom: 10,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C0A0E',
    textAlign: 'left',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 20,
  },
  tabButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#6E1424',
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6E1424',
  },
  inactiveTabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B0B0B0',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 15,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#333',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 5,
  },
  errorText: {
    color: COLORS.error,
    alignSelf: 'flex-start',
    marginBottom: 10,
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#6E1424',
    fontSize: 13,
    fontWeight: '700',
  },
  submitButtonContainer: {
    position: 'absolute',
    bottom: -25, // Half of button height to make it overlap
    alignItems: 'center',
    width: '100%',
  },
  submitButton: {
    width: 55,
    height: 55,
    backgroundColor: '#6E1424',
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6E1424',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DCDCDC',
  },
  orText: {
    marginHorizontal: 15,
    color: '#6E1424',
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 30,
  },
  bottomSketchContainer: {
    width: width,
    height: 200,
    position: 'absolute',
    bottom: 0,
    zIndex: -1,
    opacity: 0.6,
  },
  bottomSketchLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 180,
    height: 180,
  },
  bottomSketchRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 180,
    height: 180,
  },
});
