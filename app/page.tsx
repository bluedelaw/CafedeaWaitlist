"use client"

import { WaitlistCard } from "@/components/WaitlistCard"
import { db, collection, getDocs, doc, updateDoc, deleteDoc } from "@/firebaseConfig"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Page() {
  const [waitlist, setWaitlist] = useState<any[]>([])

  useEffect(() => {
    const fetchWaitlistData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "waitlist"))
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          dateAdded: doc.data().dateAdded.toDate(), // Convert Firestore Timestamp to Date
        }))
        setWaitlist(data)
      } catch (error) {
        console.error("Error fetching data: ", error)
      }
    }

    fetchWaitlistData()
  }, [])

  const handleSave = async (id: string, updatedFields: any) => {
    try {
      const waitlistRef = doc(db, "waitlist", id)
      // Convert the Date object to a Firestore Timestamp
      const updatedData = {
        ...updatedFields,
        dateAdded: updatedFields.dateAdded ? new Date(updatedFields.dateAdded) : new Date(),
      }
      await updateDoc(waitlistRef, updatedData)
      setWaitlist((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...updatedData } : entry)))
    } catch (error) {
      console.error("Error saving changes: ", error)
    }
  }

  const handleCancel = () => {
    // Logic for handling cancel, if needed (e.g., updating state or resetting UI).
  }

  const handleDelete = async (id: string) => {
    try {
      const waitlistRef = doc(db, "waitlist", id)
      await deleteDoc(waitlistRef)
      setWaitlist((prev) => prev.filter((entry) => entry.id !== id))
    } catch (error) {
      console.error("Error deleting entry: ", error)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Waitlist Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="waitlist">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
              <TabsTrigger value="reservations">Reservations</TabsTrigger>
            </TabsList>
            <TabsContent value="waitlist">
              <div className="space-y-4 mt-4">
                {waitlist
                  .filter((entry) => entry.type === "waitlist")
                  .sort((a, b) => a.dateAdded.getTime() - b.dateAdded.getTime())
                  .map((entry, index) => (
                    <WaitlistCard
                      key={entry.id}
                      id={entry.id}
                      position={index + 1}
                      name={entry.name}
                      phone={entry.phone}
                      dateAdded={entry.dateAdded}
                      partySize={entry.partySize}
                      type="waitlist"
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onDelete={handleDelete}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="reservations">
              <div className="space-y-4 mt-4">
                {waitlist
                  .filter((entry) => entry.type === "reservation")
                  .sort((a, b) => a.dateAdded.getTime() - b.dateAdded.getTime())
                  .map((entry, index) => (
                    <WaitlistCard
                      key={entry.id}
                      id={entry.id}
                      position={index + 1}
                      name={entry.name}
                      phone={entry.phone}
                      dateAdded={entry.dateAdded}
                      partySize={entry.partySize}
                      type="reservation"
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onDelete={handleDelete}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

