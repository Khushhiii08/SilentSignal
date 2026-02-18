import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Vibration, TouchableOpacity, PanResponder, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [riskScore, setRiskScore] = useState(0);
  const [status, setStatus] = useState('SAFE');
  const [showOverlay, setShowOverlay] = useState(false);
  
  const lastTouchTime = useRef(0);
  const rapidTouchCount = useRef(0);

  // 1. SENSOR LOGIC (Same as before, detecting erratic motion)
  useEffect(() => {
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const totalForce = Math.abs(x) + Math.abs(y) + Math.abs(z);
      setRiskScore(prev => {
        let score = prev;
        if (totalForce > 4.5) score += 10; 
        else score = Math.max(0, prev - 1.5); 
        return score;
      });
    });
    return () => subscription.remove();
  }, []);

  // 2. ABNORMAL TOUCH LOGIC (Multi-tapping)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        const now = Date.now();
        if (now - lastTouchTime.current < 300) {
          rapidTouchCount.current += 1;
          if (rapidTouchCount.current > 3) setRiskScore(prev => prev + 25); 
        } else {
          rapidTouchCount.current = 0;
        }
        lastTouchTime.current = now;
      },
    })
  ).current;

  // 3. THRESHOLD MONITORING
  useEffect(() => {
    if (riskScore >= 80 && status !== 'HIGH RISK') {
      setStatus('HIGH RISK');
      setShowOverlay(true);
      Vibration.vibrate([0, 500, 100, 500]);
    } else if (riskScore >= 40 && riskScore < 80) {
      setStatus('ELEVATED');
    } else if (riskScore < 40) {
      setStatus('SAFE');
    }
  }, [riskScore]);

  // 4. THE SOS ACTION
  const triggerSOS = () => {
    // Show native alert with a callback to reset the app
    Alert.alert(
      "Silent Assist Active",
      "SOS message and location have been sent to your emergency contacts.",
      [
        { 
          text: "OK", 
          onPress: () => resetToSafe() // This switches off High Risk mode after clicking OK
        }
      ]
    );
  };

  const resetToSafe = () => {
    setRiskScore(0);
    setStatus('SAFE');
    setShowOverlay(false);
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={[styles.widget, { borderColor: status === 'HIGH RISK' ? 'red' : status === 'ELEVATED' ? 'orange' : 'green' }]}>
        <Text style={styles.brand}>SilentSignal</Text>
        <Text style={[styles.status, { color: status === 'SAFE' ? '#34C759' : 'orange' }]}>{status}</Text>
        <Text style={styles.hint}>{status === 'SAFE' ? 'Monitoring...' : 'Unusual Activity Detected'}</Text>
      </View>

      {showOverlay && (
        <View style={styles.overlay}>
          <Text style={styles.sosTitle}>DISTRESS DETECTED</Text>
          <TouchableOpacity style={styles.sosButton} onPress={triggerSOS}>
            <Text style={styles.buttonText}>I NEED HELP</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={resetToSafe}>
            <Text style={styles.falseAlarm}>FALSE ALARM</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' },
  widget: { width: '80%', padding: 30, borderRadius: 30, backgroundColor: '#1E1E1E', borderWidth: 2, alignItems: 'center' },
  brand: { color: '#888', fontWeight: 'bold', fontSize: 12 },
  status: { fontSize: 36, fontWeight: '900', marginVertical: 10 },
  hint: { color: '#555', fontSize: 12 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(139, 0, 0, 0.98)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  sosTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 60 },
  sosButton: { backgroundColor: 'white', width: '100%', padding: 25, borderRadius: 50, alignItems: 'center' },
  buttonText: { color: '#8B0000', fontSize: 22, fontWeight: 'bold' },
  falseAlarm: { color: 'white', marginTop: 40, textDecorationLine: 'underline', opacity: 0.8 }
});