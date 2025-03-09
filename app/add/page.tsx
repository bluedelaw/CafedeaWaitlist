"use client"

import AddForm from "@/components/AddForm"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-800">
      <div className="bg-gray-700 text-white py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center px-4">Add to Waitlist</h1>
      </div>
      <div className="max-w-lg mx-auto my-4 sm:my-8 p-4">
        <AddForm title="Join Our Waitlist" />
      </div>
    </div>
  )
}

