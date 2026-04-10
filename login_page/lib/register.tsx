"use client"; // Required for hooks like useRouter

import { useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import type { ConfirmationResult } from "firebase/auth";
import { useRouter } from "next/navigation";

declare global {
    interface Window {
        confirmationResult?: ConfirmationResult;
    }
}

const RegisterComponent = () => {
    const router = useRouter();

    // 1. FORM STATE (Make sure these match your Input fields)
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

    // State for the OTP process
    const [otpCode, setOtpCode] = useState("");
    const [confirmationResult, setConfirmationResult] = useState<any>(null);

    // 2. THE OTP VERIFICATION FUNCTION
// 2. THE OTP VERIFICATION FUNCTION
const verifyOtp = async () => {
    // Change: Use window instead of the state variable
    if (!window.confirmationResult) return alert("Please request OTP first");

    try {
        // A. Confirm OTP with Firebase
        const result = await window.confirmationResult.confirm(otpCode);
        const user = result.user;

        console.log("OTP Verified. User UID:", user.uid);

        // B. Save Health Vault to Firestore
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
            created_at: serverTimestamp()
        });

        console.log("Health Vault created successfully!");
        router.push("/dashboard");

    } catch (error: any) {
        console.error("Registration failed:", error.code);
        alert("Verification failed: " + error.message);
    }
};

    return (
        <div className="flex flex-col gap-4 p-8" >
            <h1 className="text-2xl font-bold" > Register Health Vault </h1>

            {/* Input Example: Full Name */}
            <input
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="border p-2 rounded"
            />

            {/* OTP Input (Shown only after sending OTP) */}
            <input
                placeholder="Enter 6-digit OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="border p-2 rounded"
            />

            <button
                onClick={verifyOtp}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
                Verify & Register
            </button>
        </div>
    );
};

export default RegisterComponent;