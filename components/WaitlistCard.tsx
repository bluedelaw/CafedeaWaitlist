"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, Phone, Edit, Trash2, MessageSquare, StickyNote, Calendar } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface WaitlistCardProps {
  position?: number
  name: string
  phone: string
  partySize: number
  dateAdded: Date
  id: string
  type: "waitlist" | "reservation"
  onSave: (id: string, updatedFields: any) => void
  onCancel: () => void
  onDelete: (id: string) => void
  notes?: string
  reservationDate?: string
  reservationTime?: string
  lastSmsSent?: Date | null
  isPartialPhone: boolean
}

export const WaitlistCard: React.FC<WaitlistCardProps> = ({
  position,
  name,
  phone,
  partySize,
  dateAdded,
  id,
  type,
  onSave,
  onCancel,
  onDelete,
  notes = "",
  reservationDate,
  reservationTime,
  lastSmsSent,
  isPartialPhone,
}) => {
  const [editMode, setEditMode] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false) // Added state for confirmation dialog
  const [editFields, setEditFields] = useState({
    name,
    phone,
    partySize,
    date: new Date(dateAdded.getTime() - dateAdded.getTimezoneOffset() * 60000).toISOString().slice(0, 10),
    time: dateAdded.toTimeString().slice(0, 5),
    notes,
    reservationDate: reservationDate || "",
    reservationTime: reservationTime || "",
  })

  useEffect(() => {
    console.log("WaitlistCard props:", { type, reservationDate, reservationTime })
    console.log("Edit fields:", editFields)
  }, [type, reservationDate, reservationTime, editFields])

  const sendSMS = async (phoneNumber: string, message: string) => {
    try {
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, message }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      let responseData
      try {
        responseData = await response.json()
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError)
        throw new Error(`Failed to parse response as JSON. Raw response: ${await response.text()}`)
      }

      if (responseData.success) {
        console.log("SMS sent successfully:", responseData)
        return responseData
      } else {
        throw new Error(responseData.message || "Failed to send SMS")
      }
    } catch (error) {
      console.error("Error sending SMS:", error)
      throw error
    }
  }

  const handleSendSMS = () => {
    setIsConfirmationOpen(true) // Use the new state variable
  }

  const confirmSendSMS = async () => {
    setIsConfirmationOpen(false)
    try {
      const message = `Hi ${name}, your table is ready. Please head to cafe de A within 5 minutes. 你的坐位已經安排，請你在5分鐘內回到餐廳。`
      await sendSMS(phone, message)
      const now = new Date()
      onSave(id, { lastSmsSent: now })
      toast.success("SMS sent successfully")
    } catch (error: any) {
      console.error("Failed to send SMS:", error)
      toast.error(`Failed to send SMS: ${error.message || "Unknown error"}. Please try again or contact support.`)
    }
  }

  const handleSave = () => {
    const updatedDateAdded = new Date(`${editFields.date}T${editFields.time}`)
    const updatedFields = {
      ...editFields,
      dateAdded: updatedDateAdded,
      notes: editFields.notes,
      reservationDate: editFields.reservationDate,
      reservationTime: editFields.reservationTime,
    }
    console.log("Saving updated fields:", updatedFields)
    onSave(id, updatedFields)
    setEditMode(false)
  }

  const handleCancel = () => {
    setEditFields({
      name,
      phone,
      partySize,
      date: dateAdded.toISOString().slice(0, 10),
      time: dateAdded.toTimeString().slice(0, 5),
      notes,
      reservationDate: reservationDate || "",
      reservationTime: reservationTime || "",
    })
    setEditMode(false)
    onCancel()
  }

  const handleDelete = () => {
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    setIsDeleteDialogOpen(false)
    onDelete(id)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatLastSmsSent = (date: Date | null | undefined) => {
    if (!date) return "No SMS sent"
    return date instanceof Date
      ? date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Invalid Date"
  }

  const formatPhoneNumber = (phone: string, isPartial: boolean) => {
    if (isPartial) {
      // For partial numbers, don't try to format as a full number
      return `Last 4: ${phone}`
    }
    // For full phone numbers
    const cleaned = phone.replace(/\D/g, "")
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  const isFullPhoneNumber = phone.length > 4

  return (
    <Card className={`mb-4 ${type === "reservation" ? "bg-blue-50" : "bg-gray-50"}`}>
      <CardContent className="p-4">
        {editMode ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editFields.name}
                  onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editFields.phone}
                  onChange={(e) => setEditFields({ ...editFields, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="partySize">Party Size</Label>
                <Input
                  id="partySize"
                  type="number"
                  value={editFields.partySize}
                  onChange={(e) => setEditFields({ ...editFields, partySize: Number(e.target.value) })}
                />
              </div>
              {type === "reservation" && (
                <div>
                  <Label htmlFor="reservationTime">Reservation Time</Label>
                  <Input
                    id="reservationTime"
                    type="time"
                    value={editFields.reservationTime}
                    onChange={(e) => setEditFields({ ...editFields, reservationTime: e.target.value })}
                  />
                </div>
              )}
            </div>
            {type === "reservation" && (
              <div>
                <Label htmlFor="reservationDate">Reservation Date</Label>
                <Input
                  id="reservationDate"
                  type="date"
                  value={editFields.reservationDate}
                  onChange={(e) => setEditFields({ ...editFields, reservationDate: e.target.value })}
                />
              </div>
            )}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={editFields.notes}
                onChange={(e) => setEditFields({ ...editFields, notes: e.target.value })}
                className="h-20"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header Section */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                {position && <span className="text-sm font-medium text-gray-500">Position: {position}</span>}
                <h3 className="text-lg font-semibold">{name}</h3>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleDelete}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this {type} entry for {name}?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={confirmDelete}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSendSMS}
                      disabled={!isFullPhoneNumber}
                      className={!isFullPhoneNumber ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Confirm SMS Send</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to send an SMS to {name} at {formatPhoneNumber(phone, isPartialPhone)}?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={confirmSendSMS}>Send SMS</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Separator />

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {formatPhoneNumber(phone, isPartialPhone)}
                  {!isFullPhoneNumber && <span className="ml-2 text-xs text-red-500">(SMS unavailable)</span>}
                </p>
                <p className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  Party of {partySize}
                </p>
              </div>
              {type === "reservation" ? (
                <div className="space-y-2">
                  <p className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {reservationDate || "Date not set"}
                  </p>
                  <p className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {reservationTime || "Time not set"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {formatTime(dateAdded)}
                  </p>
                  <p className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(dateAdded)}
                  </p>
                </div>
              )}
              <div className="col-span-2 mt-2">
                <p className="flex items-center text-sm text-gray-600">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Last SMS: {formatLastSmsSent(lastSmsSent)}
                </p>
              </div>
            </div>

            {/* Notes Section */}
            {notes && (
              <>
                <Separator />
                <div className="pt-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <StickyNote className="w-4 h-4 mt-1 flex-shrink-0" />
                    <p className="flex-grow whitespace-pre-wrap">{notes}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

