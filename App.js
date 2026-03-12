import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Linking, Dimensions } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [showSOS, setShowSOS] = useState(false);
  const [countdown, setCountdown] = useState(10);
  
  const [meds, setMeds] = useState({ name: '', blood: '', allergies: '' });
  const [guardians, setGuardians] = useState([]);
  
  const timerRef = useRef(null);
  const holdTimer = useRef(null);
  const lastTap = useRef(0);
  const tapCount = useRef(0);

  // --- LOAD DATA ---
  useEffect(() => {
    const load = async () => {
      const isDone = await AsyncStorage.getItem('onboarded');
      const sMeds = await AsyncStorage.getItem('meds');
      const sGuardians = await AsyncStorage.getItem('guardians');
      if (isDone === 'true') setOnboarded(true);
      if (sMeds) setMeds(JSON.parse(sMeds));
      if (sGuardians) setGuardians(JSON.parse(sGuardians));
    };
    load();
  }, []);

  // --- 1. TOUCH AI (PANIC TAPPING) ---
  const handleGlobalTap = () => {
    const now = Date.now();
    const GAP = now - lastTap.current;

    if (GAP < 400) { // Taps within 0.4s of each other
      tapCount.current += 1;
      if (tapCount.current >= 4) {
        setRiskScore(100); // Instant Trigger
        tapCount.current = 0;
      }
    } else {
      tapCount.current = 1;
    }
    lastTap.current = now;
  };

  // --- 2. MOTION AI ---
  useEffect(() => {
    if (!onboarded || showSOS) return;
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const force = Math.sqrt(x**2 + y**2 + z**2);
      if (force > 3.8) setRiskScore(p => Math.min(100, p + 5));
      else setRiskScore(p => Math.max(0, p - 0.5));
    });
    return () => sub.remove();
  }, [onboarded, showSOS]);

  // --- 3. SOS ENGINE ---
  useEffect(() => {
    if (riskScore >= 95 && !showSOS) {
      setShowSOS(true);
      setCountdown(10);
      timerRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) { clearInterval(timerRef.current); sendSOS(); return 0; }
          return c - 1;
        });
      }, 1000);
    }
  }, [riskScore]);

  const sendSOS = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    let map = "Location Private";
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      map = `https://www.google.com/maps?q=${loc.coords.latitude},${loc.coords.longitude}`;
    }
    const msg = `🚨 SILENT SIGNAL SOS 🚨\nName: ${meds.name}\nBlood: ${meds.blood}\nAllergies: ${meds.allergies}\nLocation: ${map}`;
    const numbers = guardians.map(g => g.number);
    if (numbers.length > 0) await SMS.sendSMSAsync(numbers, msg);
    setShowSOS(false);
    setRiskScore(0);
  };

  if (!onboarded) {
    return (
      <ScrollView contentContainerStyle={styles.onboard}>
        <Text style={styles.title}>Emergency Setup</Text>
        <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#555" onChangeText={t => setMeds({...meds, name: t})} />
        <TextInput style={styles.input} placeholder="Blood Type" placeholderTextColor="#555" onChangeText={t => setMeds({...meds, blood: t})} />
        <TextInput style={[styles.input, {height: 80}]} multiline placeholder="Allergies/Meds" placeholderTextColor="#555" onChangeText={t => setMeds({...meds, allergies: t})} />
        
        <TouchableOpacity style={styles.gBtn} onPress={async () => {
          const { status } = await Contacts.requestPermissionsAsync();
          if (status === 'granted') {
            const contact = await Contacts.presentContactPickerAsync();
            if (contact?.phoneNumbers) {
              const newG = { name: contact.name, number: contact.phoneNumbers[0].number };
              setGuardians([newG]);
            }
          }
        }}><Text style={styles.gText}>{guardians[0]?.name || "+ Select Guardian"}</Text></TouchableOpacity>

        <TouchableOpacity style={styles.save} onPress={async () => {
          if (!meds.name || !guardians.length) return Alert.alert("Error", "Name and Guardian required.");
          await AsyncStorage.setItem('onboarded', 'true');
          await AsyncStorage.setItem('meds', JSON.stringify(meds));
          await AsyncStorage.setItem('guardians', JSON.stringify(guardians));
          setOnboarded(true);
        }}><Text style={styles.saveText}>ACTIVATE SILENTSIGNAL</Text></TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <TouchableOpacity 
      activeOpacity={1} 
      style={styles.container} 
      onPress={handleGlobalTap} // This detects taps anywhere
    >
      <View style={styles.widget}>
        <Text style={styles.brand}>SILENT SIGNAL AI</Text>
        <Text style={[styles.status, { color: riskScore > 50 ? '#E67E22' : '#2ECC71' }]}>
          {riskScore > 80 ? 'CRITICAL' : 'PROTECTED'}
        </Text>
        <Text style={styles.score}>Risk: {Math.floor(riskScore)}%</Text>
        <TouchableOpacity onPress={() => setOnboarded(false)}><Text style={styles.edit}>Edit Profile</Text></TouchableOpacity>
      </View>

      {showSOS && (
        <View style={styles.overlay}>
          <Text style={styles.sosTitle}>SENDING SOS IN</Text>
          <Text style={styles.timer}>{countdown}</Text>
          
          <TouchableOpacity 
            style={styles.cancelBtn}
            onPressIn={() => holdTimer.current = setTimeout(() => { setShowSOS(false); setRiskScore(0); clearInterval(timerRef.current); }, 2000)}
            onPressOut={() => clearTimeout(holdTimer.current)}
          >
            <Text style={styles.cancelText}>HOLD 2s TO CANCEL</Text>
          </TouchableOpacity>

          <View style={styles.emergencyRow}>
            <TouchableOpacity style={styles.call} onPress={() => Linking.openURL('tel:102')}><Text style={styles.callText}>🚑 AMBULANCE</Text></TouchableOpacity>
            <TouchableOpacity style={styles.call} onPress={() => Linking.openURL('tel:100')}><Text style={styles.callText}>👮 POLICE</Text></TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  onboard: { padding: 40, backgroundColor: '#000', flexGrow: 1, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 30 },
  input: { backgroundColor: '#111', color: '#fff', padding: 18, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  gBtn: { borderStyle: 'dashed', borderWidth: 1, borderColor: '#444', padding: 20, borderRadius: 15, alignItems: 'center' },
  gText: { color: '#3498DB', fontWeight: 'bold' },
  save: { backgroundColor: '#2ECC71', padding: 20, borderRadius: 15, alignItems: 'center', marginTop: 30 },
  saveText: { fontWeight: 'bold', color: '#000' },
  widget: { width: '85%', padding: 40, borderRadius: 40, backgroundColor: '#111', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  brand: { color: '#444', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
  status: { fontSize: 34, fontWeight: '900', marginVertical: 15 },
  score: { color: '#666' },
  edit: { color: '#333', marginTop: 20, fontSize: 10, textDecorationLine: 'underline' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(100,0,0,0.98)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  sosTitle: { color: '#fff', opacity: 0.7, fontSize: 18 },
  timer: { color: '#fff', fontSize: 120, fontWeight: '900' },
  cancelBtn: { backgroundColor: '#fff', padding: 20, borderRadius: 20, width: '90%', alignItems: 'center' },
  cancelText: { color: 'darkred', fontWeight: 'bold' },
  emergencyRow: { flexDirection: 'row', width: '90%', justifyContent: 'space-between', marginTop: 40 },
  call: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 15, borderRadius: 15, width: '48%', alignItems: 'center' },
  callText: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});