import { NextResponse } from "next/server"
import { db, collection, addDoc } from "@/firebaseConfig"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Received body:", body) // Log the received body

    const { name, phone, partySize, type, reservationDate, reservationTime, isPartialPhone } = body

    if (!name || !phone || !partySize || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const docData = {
      name,
      phone,
      isPartialPhone,
      partySize: Number(partySize),
      dateAdded: new Date(),
      type,
      ...(type === "reservation" && { reservationDate, reservationTime }),
    }

    console.log("Attempting to add document:", docData) // Log the document data

    const docRef = await addDoc(collection(db, "waitlist"), docData)

    console.log("Document added successfully with ID:", docRef.id) // Log successful addition

    return NextResponse.json({ success: true, id: docRef.id })
  } catch (error) {
    console.error("Error adding document: ", error)
    return NextResponse.json({ error: `Failed to add entry: ${error.message}` }, { status: 500 })
  }
}

