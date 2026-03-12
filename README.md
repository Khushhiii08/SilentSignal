# SilentSignal 📱🛡️
**Edge-AI Behavioral Analysis & Automated Emergency Response System**

SilentSignal is a privacy-centric safety tool designed for high-stress situations where a user cannot speak or manually trigger a traditional SOS. By utilizing **on-device sensor fusion** and **behavioral pattern recognition**, it detects physical distress and automates emergency notifications.

---

## 🚀 The Problem
Traditional safety apps often fail in high-adrenaline scenarios because they:
- **Require fine motor skills:** Precise screen interaction is difficult during a struggle.
- **Require voice commands:** Panic or hostile environments often make speech impossible.
- **High False Positive Rates:** Standard motion detectors can't tell the difference between a jog and a jump-scare.

## ✨ The "Silent" Solution: Behavioral AI
SilentSignal calculates a real-time **Risk Score (0-100%)** using a heuristic-based Edge AI engine:

1.  **📊 Normalized Tremor Detection:** Uses the Accelerometer to identify physiological micro-movements associated with acute distress.
2.  **🧠 Personalized Calibration:** Features a "Personal Calibration" mode to establish a baseline $G$ force, significantly reducing false positives.
3.  **📱 Temporal Touch Analysis:** A global listener identifies "panic tapping" (temporal sequences of rapid, uncoordinated multi-touch events).
4.  **⏳ Discrete Veto Logic:** A 10-second "Hold-to-Stay-Safe" countdown allows the user to cancel the alert with a non-obvious long press.

---

## 🛠️ Intelligent SOS Flow

| Phase | Action | Tech Involved |
| :--- | :--- | :--- |
| **Detection** | Risk Score crosses 95% threshold via sensor fusion. | `expo-sensors` |
| **Validation** | 10s Haptic Countdown (User can "Veto" via Hold). | `expo-haptics` |
| **Response** | Auto-sends SMS with active Google Maps link. | `expo-sms` + `expo-location` |
| **Context** | Appends Blood Type, Allergies, and Meds to the alert. | `AsyncStorage` |

---

## 💻 Tech Stack & Engineering
- **Framework:** React Native (Expo)
- **Data Persistence:** `AsyncStorage` for persistent, on-device Medical Records and Guardian lists.
- **Smart Contact Logic:** Intelligently filters user contact books to identify "Real" contacts, preventing alerts from being sent to automated or scam numbers.
- **Edge Processing:** All behavioral analysis is performed locally to ensure zero-latency and maximum data privacy.

## 🛡️ Privacy & Ethics
- **Zero Surveillance:** No access to camera, microphone, or biometric databases.
- **Local-First:** All AI logic and medical data remain on-device; nothing is uploaded to the cloud.
- **Geo-Privacy:** GPS coordinates are only accessed and shared at the specific moment of a confirmed SOS event.

---

## ⚙️ Installation & Setup

1. **Clone the repo:**
   ```bash
   git clone [https://github.com/Khushhiii08/SilentSignal.git](https://github.com/Khushhiii08/SilentSignal.git)
   cd SilentSignal
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the app:**
   ```bash
   npx expo start --tunnel
   ```
*Scan the QR code using the Expo Go app on your Android or iOS device.*

## 🔮 Future Scope
- **Wearable Integration:** Integrating Heart Rate Variability (HRV) as a secondary validation signal for users with smartwatches.

- **Contextual Awareness:** Using step-counting (Pedometer) to dynamically adjust motion sensitivity during physical exercise.

***Developed for the AMD Slingshot Hackathon.***