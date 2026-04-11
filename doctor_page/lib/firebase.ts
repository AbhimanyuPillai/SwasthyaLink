import { initializeApp, getApps, getApp } from "firebase/app"
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  or,
  addDoc,
  serverTimestamp,
  orderBy
} from "firebase/firestore"
import { Patient, MedicalRecord } from "./patient-context"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
export const db = getFirestore(app, "slink")

export async function handlePatientLookup(searchQuery: string): Promise<Patient | null> {
  try {
    const cleanQuery = searchQuery.trim()
    if (!cleanQuery) return null

    const usersRef = collection(db, "users")

    // Create query where swasthya_id == cleanQuery OR phone == cleanQuery
    const q = query(
      usersRef,
      or(
        where("swasthya_id", "==", cleanQuery),
        where("phone", "==", cleanQuery)
      )
    )

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    // 1. Get the main patient document
    const patientDoc = querySnapshot.docs[0]
    const docData = patientDoc.data()
    const patientId = patientDoc.id

    // 2. Fetch their medical records from the subcollection!
    // This looks inside: users -> [patientId] -> records
    const recordsRef = collection(db, "users", patientId, "records")
    const recordsQuery = query(recordsRef, orderBy("dateAdded", "desc")) // Newest first
    const recordsSnapshot = await getDocs(recordsQuery)

    // Map the subcollection docs into an array
    const fetchedMedicalHistory = recordsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MedicalRecord[]

    // 3. Assemble the final Patient object
    const patientData: Patient = {
      id: patientId,
      swasthyaId: docData.swasthya_id || docData.swasthyaId,
      name: docData.full_name || docData.name,
      phone: docData.phone,
      age: docData.age || 0,
      gender: docData.gender || "Unknown",
      bloodGroup: docData.blood_group || docData.bloodGroup || "Unknown",
      address: docData.address || docData.area_zone || "N/A",
      // Adding photoUrl so the Doctor UI can display the image Amogh's code uploaded
      photoUrl: docData.photo_url || docData.photoUrl || "",
      medicalHistory: fetchedMedicalHistory
    }

    return patientData

  } catch (error) {
    console.error("Error looking up patient in Firestore: ", error)
    return null
  }
}

// ==========================================
// DOCTOR ACTION: Save a new prescription
// ==========================================
export async function addMedicalRecord(patientId: string, recordData: any) {
  try {
    // Point directly to this specific patient's subcollection
    const recordsRef = collection(db, "users", patientId, "records")

    const docRef = await addDoc(recordsRef, {
      ...recordData,
      dateAdded: serverTimestamp() // Let Google handle the exact timestamp
    })

    return docRef.id // Return the ID in case your UI needs it for a success message
  } catch (error) {
    console.error("Error adding medical record: ", error)
    throw error
  }
}