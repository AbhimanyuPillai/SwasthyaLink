"use client";

import { useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// 1. Added Storage imports
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    confirmationResult?: ConfirmationResult;
    recaptchaVerifier?: any;
  }
}

const RegisterComponent = () => {
  const router = useRouter();
  const storage = getStorage(); // Initialize Storage

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    mobileNumber: "",
    emergencyContact: "",
    height: "",
    weight: "",
  });

  // 2. Added state for the Image File
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {
    if (!window.confirmationResult) return alert("Please request OTP first");
    setLoading(true);

    try {
      // A. Confirm OTP
      const result = await window.confirmationResult.confirm(otpCode);
      const user = result.user;
      let photoUrl = "";

      // B. Handle Image Upload to Firebase Storage
      if (profileImage) {
        // Path: profile_photos/USER_ID/profile.jpg
        const storageRef = ref(storage, `profile_photos/${user.uid}/profile.jpg`);
        const snapshot = await uploadBytes(storageRef, profileImage);
        photoUrl = await getDownloadURL(snapshot.ref);
        console.log("Image uploaded successfully:", photoUrl);
      }

      // C. Save to Firestore (The Health Vault)
      await setDoc(doc(db, "users", user.uid), {
        full_name: formData.fullName,
        email: formData.email,
        phone: user.phoneNumber,
        photo_url: photoUrl, // Saving the Storage URL here
        blood_group: formData.bloodGroup,
        dob: formData.dob,
        gender: formData.gender,
        emergency_contact: formData.emergencyContact,
        height_cm: Number(formData.height),
        weight_kg: Number(formData.weight),
        conditions: [],
        created_at: serverTimestamp(),
      });

      console.log("Firestore Doc Created. Redirecting...");
      router.push("/dashboard");
    } catch (error: unknown) {
      setLoading(false);
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Registration failed:", error);
      alert("Verification failed: " + message);
    }
  };

  const sendOtp = async () => {
    if (!formData.mobileNumber || formData.mobileNumber.length < 10) {
      alert("Please enter a valid mobile number");
      return;
    }

    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
      
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container-register", {
        size: "invisible",
      });

      const formatted = formData.mobileNumber.startsWith("+91")
        ? formData.mobileNumber
        : `+91${formData.mobileNumber.replace(/\D/g, "").slice(-10)}`;

      const confirmation = await signInWithPhoneNumber(auth, formatted, window.recaptchaVerifier);
      window.confirmationResult = confirmation;
      alert("OTP sent to " + formatted);
    } catch (error) {
      console.error("SMS Error:", error);
      alert("Failed to send OTP. Check if your Firebase project has Phone Auth enabled.");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-8 max-w-md mx-auto">
      <div id="recaptcha-container-register" />
      <h1 className="text-2xl font-bold">Register Health Vault</h1>

      {/* 3. Added Image Input Field */}
      <label className="text-sm font-medium">Profile Photo</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
        className="border p-2 rounded"
      />

      <input
        placeholder="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        className="border p-2 rounded"
      />

      <input
        placeholder="Mobile (e.g. 9876543210)"
        value={formData.mobileNumber}
        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
        className="border p-2 rounded"
      />

      <button 
        type="button" 
        onClick={sendOtp} 
        className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700"
      >
        Send OTP
      </button>

      <hr />

      <input
        placeholder="Enter 6-digit OTP"
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value)}
        className="border p-2 rounded text-center tracking-widest"
        maxLength={6}
      />

      <button
        type="button"
        disabled={loading}
        onClick={verifyOtp}
        className={`${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white p-2 rounded hover:bg-blue-700`}
      >
        {loading ? "Registering..." : "Verify & Register"}
      </button>
    </div>
  );
};

export default RegisterComponent;