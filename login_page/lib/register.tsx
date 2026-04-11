"use client";

import { useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    confirmationResult?: ConfirmationResult
    recaptchaVerifier?: any
  }
}

const RegisterComponent = () => {
  const router = useRouter();

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

  const [otpCode, setOtpCode] = useState("");

  const verifyOtp = async () => {
    if (!window.confirmationResult) return alert("Please request OTP first");

    try {
      const result = await window.confirmationResult.confirm(otpCode);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        full_name: formData.fullName,
        email: formData.email,
        phone: user.phoneNumber,
        blood_group: formData.bloodGroup,
        dob: formData.dob,
        gender: formData.gender,
        emergency_contact: formData.emergencyContact,
        height_cm: Number(formData.height),
        weight_kg: Number(formData.weight),
        conditions: [],
        created_at: serverTimestamp(),
      });

      router.push("/dashboard");
    } catch (error: unknown) {
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
        window.recaptchaVerifier = undefined;
      }
      const container = document.getElementById("recaptcha-container-register");
      if (container) container.innerHTML = "";

      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container-register", {
        size: "invisible",
      });
      const formatted = formData.mobileNumber.startsWith("+91")
        ? formData.mobileNumber
        : `+91${formData.mobileNumber.replace(/\D/g, "").slice(-10)}`;

      const confirmation = await signInWithPhoneNumber(auth, formatted, window.recaptchaVerifier);
      window.confirmationResult = confirmation;
      alert("OTP sent");
    } catch (error) {
      console.error("SMS Error:", error);
      alert("Failed to send OTP.");
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <div id="recaptcha-container-register" />
      <h1 className="text-2xl font-bold">Register Health Vault</h1>

      <input
        placeholder="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        className="border p-2 rounded"
      />

      <input
        placeholder="Mobile (+91)"
        value={formData.mobileNumber}
        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
        className="border p-2 rounded"
      />

      <button type="button" onClick={sendOtp} className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700">
        Send OTP
      </button>

      <input
        placeholder="Enter 6-digit OTP"
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value)}
        className="border p-2 rounded"
      />

      <button
        type="button"
        onClick={verifyOtp}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Verify & Register
      </button>
    </div>
  );
};

export default RegisterComponent;
