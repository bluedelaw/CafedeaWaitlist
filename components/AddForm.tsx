"use client"

import type React from "react"
import { useState } from "react"
import { db, collection, addDoc } from "@/firebaseConfig"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface FormInputs {
  name: string
  phone: string
  partySize: number
  reservationTime?: string
  errors: {
    name: string
    phone: string
    partySize: string
    reservationTime?: string
  }
}

interface AddFormProps {
  type?: "waitlist" | "reservation"
  title?: string
}

const AddForm: React.FC<AddFormProps> = ({ type = "waitlist", title }) => {
  const [formInputs, setFormInputs] = useState<FormInputs>({
    name: "",
    phone: "",
    partySize: 1,
    reservationTime: "",
    errors: { name: "", phone: "", partySize: "", reservationTime: "" },
  })

  const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return phoneRegex.test(phone)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target

    setFormInputs((prev) => {
      const newErrors = { ...prev.errors }

      switch (id) {
        case "name":
          newErrors.name = value ? "" : "Name is required."
          break
        case "phone":
          newErrors.phone = value
            ? isValidPhoneNumber(value)
              ? ""
              : "Invalid Phone Number."
            : "Phone Number is required."
          break
        case "partySize":
          newErrors.partySize = Number(value) >= 1 ? "" : "Party Size must be at least 1."
          break
        case "reservationTime":
          if (type === "reservation") {
            newErrors.reservationTime = value ? "" : "Reservation time is required."
          }
          break
      }

      return {
        ...prev,
        [id]: id === "partySize" ? Number(value) : value,
        errors: newErrors,
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const hasErrors = Object.values(formInputs.errors).some((error) => error)
    const missingFields = !formInputs.name || !formInputs.phone || formInputs.partySize < 1
    const missingReservationTime = type === "reservation" && !formInputs.reservationTime

    if (hasErrors || missingFields || missingReservationTime) {
      alert("Please fix errors before submitting.")
      return
    }

    try {
      await addDoc(collection(db, "waitlist"), {
        name: formInputs.name,
        phone: formInputs.phone,
        partySize: formInputs.partySize,
        dateAdded: new Date(),
        type,
        ...(type === "reservation" && { reservationTime: formInputs.reservationTime }),
      })

      alert(`${type === "reservation" ? "Reservation" : "Waitlist"} entry added successfully!`)
      setFormInputs({
        name: "",
        phone: "",
        partySize: 1,
        reservationTime: "",
        errors: { name: "", phone: "", partySize: "", reservationTime: "" },
      })
    } catch (error) {
      console.error("Error adding document: ", error)
      alert("Error adding entry. Please try again.")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-700 text-white shadow-lg">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-semibold text-center">
          {title || (type === "reservation" ? "Make a Reservation" : "Join Waitlist")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white text-sm sm:text-base">
              Name
            </Label>
            <Input
              id="name"
              value={formInputs.name}
              onChange={handleChange}
              required
              className="bg-gray-600 text-white border-gray-500 text-sm sm:text-base p-2 sm:p-3"
            />
            {formInputs.errors.name && <p className="text-red-400 text-xs sm:text-sm">{formInputs.errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white text-sm sm:text-base">
              Phone Number
            </Label>
            <Input
              id="phone"
              value={formInputs.phone}
              onChange={handleChange}
              required
              className="bg-gray-600 text-white border-gray-500 text-sm sm:text-base p-2 sm:p-3"
            />
            {formInputs.errors.phone && <p className="text-red-400 text-xs sm:text-sm">{formInputs.errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="partySize" className="text-white text-sm sm:text-base">
              Party Size
            </Label>
            <Input
              id="partySize"
              type="number"
              value={formInputs.partySize}
              onChange={handleChange}
              min={1}
              required
              className="bg-gray-600 text-white border-gray-500 text-sm sm:text-base p-2 sm:p-3"
            />
            {formInputs.errors.partySize && (
              <p className="text-red-400 text-xs sm:text-sm">{formInputs.errors.partySize}</p>
            )}
          </div>

          {type === "reservation" && (
            <div className="space-y-2">
              <Label htmlFor="reservationTime" className="text-white text-sm sm:text-base">
                Reservation Time
              </Label>
              <Input
                id="reservationTime"
                type="time"
                value={formInputs.reservationTime}
                onChange={handleChange}
                required
                className="bg-gray-600 text-white border-gray-500 text-sm sm:text-base p-2 sm:p-3"
              />
              {formInputs.errors.reservationTime && (
                <p className="text-red-400 text-xs sm:text-sm">{formInputs.errors.reservationTime}</p>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-2 sm:py-3"
          >
            Add {type === "reservation" ? "Reservation" : "Waitlist"} Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddForm

