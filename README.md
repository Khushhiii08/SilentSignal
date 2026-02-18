# SilentSignal 📱🛡️

**Privacy-First Non-Verbal Distress Detection & Assistive Response System**

SilentSignal is an AI-powered safety tool designed for moments when a user cannot speak or manually trigger an SOS. It uses on-device sensor fusion to detect physical distress patterns without the need for cameras, microphones, or cloud-based tracking.

---

## 🚀 The Problem
Many existing safety solutions fail because they:
- Require voice commands (impossible during panic attacks or in hostile environments).
- Require precise screen interaction (difficult during physical struggle).
- Rely on heavy surveillance (privacy concerns).

## ✨ Our Solution: The "Silent" Approach
SilentSignal monitors three key on-device signals to calculate a real-time **Risk Score**:
1.  **📊 Accelerometer-based Tremor Detection:** Identifies the physiological micro-movements associated with panic or fear.
2.  **🤲 Erratic Motion Analysis:** Detects high-impact physical struggle or sudden drops.
3.  **📱 Abnormal Touch Patterns:** Identifies "button mashing" or rapid, uncoordinated multi-touch events typical of emergency situations.

---

## 🛠️ Case Scenarios

| State | Indicator | Criteria | Action |
| :--- | :--- | :--- | :--- |
| **SAFE** | 🟢 Green | Normal usage / Static device. | Background monitoring active. |
| **ELEVATED** | 🟠 Orange | Mild tremors or repeated rapid tapping. | Triggers "Take a Breather" haptic guide. |
| **HIGH RISK** | 🔴 Red | High-force movement + aggressive multi-touch. | Opens SOS Assist Overlay with "I Need Help" & "False Alarm". |

---

## 💻 Tech Stack
- **Framework:** React Native (Expo)
- **Sensors:** `expo-sensors` (Accelerometer)
- **State Management:** React Hooks (Effective for real-time risk scoring)
- **Design:** Widget-first, low-cognitive-load UI.

## 🛡️ Privacy & Ethics
- **No Cameras / Microphones:** We do not record any audio or video.
- **100% On-Device:** All AI logic and sensor processing happen on the user's RAM.
- **No Identity Tracking:** Your location is only sent to *your* chosen contacts during a confirmed High Risk event.

---

## ⚙️ Installation & Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Khushhiii08/SilentSignal.git
   cd SilentSignal
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the app:**
   ```bash
   npx expo start
   ```
   *Scan the QR code using the Expo Go app on your iOS or Android device.*

## 🔮 Future Scope
- Smartwatch Integration: Capturing heart-rate variability (HRV) for more accurate panic detection.
- Personalized AI: Calibration mode to learn a user's specific motor patterns.
- Emergency Services: Direct API integration with local emergency dispatch.

***Developed for the AMD Slingshot Hackathon.***
