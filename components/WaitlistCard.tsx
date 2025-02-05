import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Users, Phone, Edit, Trash2, MessageSquare } from "lucide-react"

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
}) => {
  const [editMode, setEditMode] = useState(false)
  const [editFields, setEditFields] = useState({
    name,
    phone,
    partySize,
    date: new Date(dateAdded.getTime() - dateAdded.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10),
    time: dateAdded.toTimeString().slice(0, 5), // HH:mm
  })

  const sendSMS = async (phoneNumber: string, message: string) => {
    try {
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, message }),
      })

      if (response.ok) {
        console.log("SMS sent successfully")
      } else {
        console.error("Failed to send SMS")
      }
    } catch (error) {
      console.error("Error sending SMS:", error)
    }
  }

  const handleSendSMS = () => {
    const message = "Your table is ready! Please head to the restaurant to be seated. 你的坐位已經安排，請你在5分鐘內回到餐廳。"
    sendSMS(phone, message)
  }

  const handleSave = () => {
    const updatedDateAdded = new Date(`${editFields.date}T${editFields.time}`)
    onSave(id, { ...editFields, dateAdded: updatedDateAdded })
    setEditMode(false)
  }

  const handleCancel = () => {
    setEditFields({
      name,
      phone,
      partySize,
      date: dateAdded.toISOString().slice(0, 10),
      time: dateAdded.toTimeString().slice(0, 5),
    })
    setEditMode(false)
    onCancel()
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

  return (
    <Card className={`mb-4 ${type === "reservation" ? "bg-blue-50" : "bg-gray-50"}`}>
      <CardContent className="p-4">
        {position && <p className="text-sm text-gray-500 mb-2">Position: {position}</p>}
        {editMode ? (
          <div className="space-y-4">
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
            <div>
              <Label htmlFor="partySize">Party Size</Label>
              <Input
                id="partySize"
                type="number"
                value={editFields.partySize}
                onChange={(e) => setEditFields({ ...editFields, partySize: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={editFields.date}
                onChange={(e) => setEditFields({ ...editFields, date: e.target.value })}
                disabled={type === "waitlist"}
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={editFields.time}
                onChange={(e) => setEditFields({ ...editFields, time: e.target.value })}
                disabled={type === "waitlist"}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              {phone}
            </p>
            <p className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              Party of {partySize}
            </p>
            <p className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {formatDate(dateAdded)} at {formatTime(dateAdded)}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-100 p-4 flex justify-between">
        {editMode ? (
          <>
            <Button variant="default" onClick={handleSave}>
              Save
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(id)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button variant="outline" size="sm" onClick={handleSendSMS}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Send SMS
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}