"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getWaitlistCount } from "@/firebaseConfig"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import WaitlistConfirmation from "@/components/WaitlistConfirmation"
import { toast } from "@/components/ui/toast"
import { Loader2 } from "lucide-react"

interface FormInputs {
  name: string
  phone: string
  partySize: string
  reservationTime?: string
  reservationDate?: string
  isPartialPhone: boolean
  errors: {
    name: string
    phone: string
    partySize: string
    reservationTime?: string
    reservationDate: string
  }
}

interface AddFormProps {
  type?: "waitlist" | "reservation"
  title?: string
}

const CustomInput = ({ id, value, onChange, required, type = "text", ...props }) => (
  <Input
    id={id}
    value={value}
    onChange={onChange}
    required={required}
    type={type}
    className="bg-gray-600 text-white border-gray-500 text-base sm:text-lg px-4 py-3 sm:py-4 w-full mx-auto"
    onFocus={(e) => {
      if (typeof window !== "undefined") {
        setTimeout(() => {
          const elementRect = e.target.getBoundingClientRect()
          const absoluteElementTop = elementRect.top + window.pageYOffset
          const middle = absoluteElementTop - window.innerHeight / 2
          window.scrollTo(0, middle)
        }, 100)
      }
    }}
    {...props}
  />
)

const AddForm: React.FC<AddFormProps> = ({ type = "waitlist", title }) => {
  const [formInputs, setFormInputs] = useState<FormInputs>({
    name: "",
    phone: "",
    partySize: "",
    reservationTime: "",
    reservationDate: "",
    isPartialPhone: false,
    errors: { name: "", phone: "", partySize: "", reservationTime: "", reservationDate: "" },
  })
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [waitlistCount, setWaitlistCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Commented out geolocation-related state
  // const [token, setToken] = useState("")
  // const [locationStatus, setLocationStatus] = useState<"pending" | "success" | "error">("pending")

  // useEffect(() => {
  //   if (type === "waitlist") {
  //     fetchToken()
  //   }
  // }, [type])

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const isValidPhoneNumber = (phone: string, isPartial: boolean): boolean => {
    if (isPartial) {
      return /^\d{4}$/.test(phone)
    }
    return /^\d{10}$/.test(phone)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    setFormInputs((prev) => {
      const newErrors = { ...prev.errors }

      switch (id) {
        case "name":
          newErrors.name = value ? "" : "Name is required."
          break
        case "phone":
          newErrors.phone = value
            ? isValidPhoneNumber(value, prev.isPartialPhone)
              ? ""
              : prev.isPartialPhone
                ? "Please enter exactly 4 digits for the partial phone number."
                : "Please enter exactly 10 digits for the full phone number."
            : "Phone Number is required."
          break
        case "partySize":
          const partySizeValue = value === "" ? 0 : Number.parseInt(value, 10)
          newErrors.partySize =
            !isNaN(partySizeValue) && partySizeValue >= 1 ? "" : "Party Size must be a number and at least 1."
          break
        case "reservationTime":
          if (type === "reservation") {
            newErrors.reservationTime = value ? "" : "Reservation time is required."
          }
          break
        case "reservationDate":
          if (type === "reservation") {
            newErrors.reservationDate = value ? "" : "Reservation date is required."
          }
          break
      }

      return {
        ...prev,
        [id]: value,
        errors: newErrors,
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Scroll to the top of the form
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
    }

    // Wait for a short time to ensure the scroll has completed
    await new Promise((resolve) => setTimeout(resolve, 100))

    console.log("Submit button clicked")

    const hasErrors = Object.values(formInputs.errors).some((error) => error)
    const missingFields =
      !formInputs.name ||
      !formInputs.phone ||
      formInputs.partySize === "" ||
      Number.parseInt(formInputs.partySize, 10) < 1
    const missingReservationInfo =
      type === "reservation" && (!formInputs.reservationTime || !formInputs.reservationDate)

    if (hasErrors || missingFields || missingReservationInfo) {
      toast.error("Please fix errors before submitting.")
      return
    }

    if (type === "waitlist") {
      // Removed location verification check
      console.log("Fetching waitlist count")
      const count = await getWaitlistCount()
      setWaitlistCount(count)
      console.log("Waitlist count:", count)
      console.log("Opening confirmation dialog")
      setIsConfirmationOpen(true)
    } else {
      console.log("Submitting reservation")
      await addEntryToDatabase()
    }
  }

  // Commented out fetchToken function
  // const fetchToken = async () => {
  //   // ... (previous fetchToken code)
  // }

  const addEntryToDatabase = async () => {
    try {
      console.log("Submitting entry - Type:", type)
      console.log("Form inputs:", formInputs)

      const response = await fetch("/api/add-to-waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formInputs.name,
          phone: formInputs.phone,
          partySize: formInputs.partySize,
          type,
          isPartialPhone: formInputs.isPartialPhone,
          ...(type === "reservation" && {
            reservationDate: formInputs.reservationDate,
            reservationTime: formInputs.reservationTime,
          }),
        }),
      })

      const data = await response.json()
      console.log("Server response:", data)

      if (data.success) {
        toast.success(`${type === "reservation" ? "Reservation" : "Waitlist"} entry added successfully!`)
        setFormInputs({
          name: "",
          phone: "",
          partySize: "",
          reservationTime: "",
          reservationDate: "",
          isPartialPhone: false,
          errors: { name: "", phone: "", partySize: "", reservationTime: "", reservationDate: "" },
        })
      } else {
        throw new Error(data.error || "Failed to add entry")
      }
    } catch (error) {
      console.error("Error adding entry:", error)
      toast.error(`Error adding entry: ${error.message}. Please try again.`)
    }
  }

  const handleConfirmation = async () => {
    setIsConfirmationOpen(false)
    await addEntryToDatabase()
  }

  // Removed handleRecheckLocation function

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isPartialPhone = e.target.checked
    setFormInputs((prev) => ({
      ...prev,
      isPartialPhone,
      phone: "", // Clear the phone number when toggling
      errors: {
        ...prev.errors,
        phone: "", // Clear any existing phone errors
      },
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-700 text-white shadow-lg">
      <CardHeader className="p-6 sm:p-8">
        <CardTitle className="text-2xl sm:text-3xl font-semibold text-center">
          {title || (type === "reservation" ? "Make a Reservation" : "Join Waitlist")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        {/* Removed location status display */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 px-1">
            <Label htmlFor="name" className="text-white text-base sm:text-lg">
              Name
            </Label>
            <CustomInput id="name" value={formInputs.name} onChange={handleChange} required />
            {formInputs.errors.name && <p className="text-red-400 text-sm sm:text-base">{formInputs.errors.name}</p>}
          </div>

          <div className="space-y-2 px-1">
            <Label htmlFor="partySize" className="text-white text-base sm:text-lg">
              Party Size
            </Label>
            <CustomInput
              id="partySize"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formInputs.partySize}
              onChange={handleChange}
              required
            />
            {formInputs.errors.partySize && (
              <p className="text-red-400 text-sm sm:text-base">{formInputs.errors.partySize}</p>
            )}
          </div>

          <div className="space-y-2 px-1">
            <Label htmlFor="phone" className="text-white text-base sm:text-lg">
              {formInputs.isPartialPhone ? "Last 4 Digits of Phone Number" : "Full Phone Number"}
            </Label>
            <CustomInput
              id="phone"
              type="tel"
              inputMode="numeric"
              pattern={formInputs.isPartialPhone ? "[0-9]{4}" : "[0-9]{10}"}
              value={formInputs.phone}
              onChange={handleChange}
              required
              placeholder={formInputs.isPartialPhone ? "1234" : "1234567890"}
            />
            {formInputs.errors.phone && <p className="text-red-400 text-sm sm:text-base">{formInputs.errors.phone}</p>}
          </div>

          <div className="flex items-center space-x-2 px-1">
            <Checkbox
              id="isPartialPhone"
              checked={formInputs.isPartialPhone}
              onCheckedChange={(checked) => handleCheckboxChange({ target: { checked } } as any)}
            />
            <Label
              htmlFor="isPartialPhone"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Use only last 4 digits of phone number
            </Label>
          </div>

          {type === "reservation" && (
            <>
              <div className="space-y-2 px-1">
                <Label htmlFor="reservationDate" className="text-white text-base sm:text-lg">
                  Reservation Date
                </Label>
                <CustomInput
                  id="reservationDate"
                  type="date"
                  value={formInputs.reservationDate}
                  onChange={handleChange}
                  required
                />
                {formInputs.errors.reservationDate && (
                  <p className="text-red-400 text-sm sm:text-base">{formInputs.errors.reservationDate}</p>
                )}
              </div>
              <div className="space-y-2 px-1">
                <Label htmlFor="reservationTime" className="text-white text-base sm:text-lg">
                  Reservation Time
                </Label>
                <CustomInput
                  id="reservationTime"
                  type="time"
                  value={formInputs.reservationTime}
                  onChange={handleChange}
                  required
                />
                {formInputs.errors.reservationTime && (
                  <p className="text-red-400 text-sm sm:text-base">{formInputs.errors.reservationTime}</p>
                )}
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg sm:text-xl py-3 sm:py-4 mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </span>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </CardContent>
      <WaitlistConfirmation
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmation}
        waitlistCount={waitlistCount}
      />
    </Card>
  )
}

export default AddForm

