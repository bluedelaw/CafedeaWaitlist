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
        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data()
          return {
            ...docData,
            id: doc.id,
            dateAdded: docData.dateAdded?.toDate() || new Date(),
            lastSmsSent: docData.lastSmsSent?.toDate() || null,
            isPartialPhone: docData.isPartialPhone || false, // Ensure this field is included
          }
        })
        console.log("Fetched waitlist data:", data)
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
      let updatedData: any = {}

      if (updatedFields.lastSmsSent) {
        // If lastSmsSent is being updated, only update this field
        updatedData = { lastSmsSent: updatedFields.lastSmsSent }
      } else {
        // For other updates, include all fields except lastSmsSent
        updatedData = {
          ...updatedFields,
          dateAdded: updatedFields.dateAdded ? new Date(updatedFields.dateAdded) : new Date(),
        }
        // Preserve the existing lastSmsSent if it's not being updated
        const existingEntry = waitlist.find((entry) => entry.id === id)
        if (existingEntry && existingEntry.lastSmsSent) {
          updatedData.lastSmsSent = existingEntry.lastSmsSent
        }
      }

      console.log("Updating document with data:", updatedData)
      await updateDoc(waitlistRef, updatedData)

      setWaitlist((prev) => {
        const updatedWaitlist = prev.map((entry) => (entry.id === id ? { ...entry, ...updatedData } : entry))

        // Re-sort the waitlist
        return updatedWaitlist.sort((a, b) => {
          if (a.type === "reservation" && b.type === "reservation") {
            // For reservations, sort by reservation date and time
            const aDateTime = new Date(`${a.reservationDate}T${a.reservationTime}`)
            const bDateTime = new Date(`${b.reservationDate}T${b.reservationTime}`)
            return aDateTime.getTime() - bDateTime.getTime()
          } else if (a.type === "waitlist" && b.type === "waitlist") {
            // For waitlist entries, sort by dateAdded
            return a.dateAdded.getTime() - b.dateAdded.getTime()
          } else {
            // If comparing different types, prioritize reservations
            return a.type === "reservation" ? -1 : 1
          }
        })
      })
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
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Waitlist</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="waitlist" className="w-full">
            <TabsList className="hidden">
              <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
            </TabsList>
            <TabsContent value="waitlist">
              <div className="space-y-4">
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
                      type={entry.type}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onDelete={handleDelete}
                      notes={entry.notes}
                      lastSmsSent={entry.lastSmsSent}
                      isPartialPhone={entry.isPartialPhone} // Make sure this is being passed
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

