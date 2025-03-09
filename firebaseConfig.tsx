import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, deleteDoc, query, where } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
}

console.log("Firebase Config:", {
  apiKey: process.env.NEXT_PUBLIC_API_KEY ? "Set" : "Not set",
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN ? "Set" : "Not set",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ? "Set" : "Not set",
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET ? "Set" : "Not set",
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID ? "Set" : "Not set",
  appId: process.env.NEXT_PUBLIC_APP_ID ? "Set" : "Not set",
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID ? "Set" : "Not set",
})

let db

try {
  const app = initializeApp(firebaseConfig)
  console.log("Firebase initialized successfully")
  db = getFirestore(app)
  console.log("Firestore instance created")
} catch (error) {
  console.error("Error initializing Firebase:", error)
}

const getWaitlistCount = async () => {
  try {
    const waitlistQuery = query(collection(db, "waitlist"), where("type", "==", "waitlist"))
    const querySnapshot = await getDocs(waitlistQuery)
    return querySnapshot.size
  } catch (error) {
    console.error("Error getting waitlist count:", error)
    throw error
  }
}

const addEntryToDatabase = async (formData) => {
  try {
    await addDoc(collection(db, "waitlist"), {
      name: formData.name,
      phone: formData.phone,
      partySize: Number.parseInt(formData.partySize, 10),
      dateAdded: new Date(),
      type: formData.type,
      lastSmsSent: null, // Initialize with null
      ...(formData.type === "reservation" && {
        reservationDate: formData.reservationDate,
        reservationTime: formData.reservationTime,
      }),
    })
  } catch (error) {
    console.error("Error adding document: ", error)
    throw error
  }
}

export { db, collection, getDocs, doc, updateDoc, addDoc, deleteDoc, getWaitlistCount, addEntryToDatabase }

