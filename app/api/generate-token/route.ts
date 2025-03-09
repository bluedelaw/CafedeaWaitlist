import { NextResponse } from "next/server"
import crypto from "crypto"

const SECRET_KEY = process.env.TOKEN_SECRET_KEY || "default-secret-key"
const TOKEN_EXPIRY = 5 * 60 * 1000 // 5 minutes in milliseconds

// Commented out location-related constants
// const CAFE_LATITUDE = 49.185417
// const CAFE_LONGITUDE = -122.936861
// const ALLOWED_RADIUS = 3000 // 3000 meters radius

export async function GET(request: Request) {
  // This route is no longer used, but we'll keep it for now
  return NextResponse.json({ error: "This route is currently disabled" }, { status: 403 })

  // Previous implementation commented out
  /*
  const { searchParams } = new URL(request.url)
  const latitude = searchParams.get("lat")
  const longitude = searchParams.get("lng")

  console.log(`Received request with lat: ${latitude}, lng: ${longitude}`)

  if (!latitude || !longitude) {
    console.log("Missing latitude or longitude")
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  const isInValidLocation = checkLocation(Number.parseFloat(latitude), Number.parseFloat(longitude))

  console.log(`Is in valid location: ${isInValidLocation}`)

  if (!isInValidLocation) {
    return NextResponse.json({ error: "Location is not within the allowed area" }, { status: 403 })
  }

  const token = generateToken()
  const expiresAt = Date.now() + TOKEN_EXPIRY

  console.log(`Generated token: ${token}`)
  console.log(`Request latitude: ${latitude}, longitude: ${longitude}`)
  console.log(`Cafe latitude: ${CAFE_LATITUDE}, longitude: ${CAFE_LONGITUDE}`)
  console.log(`Allowed radius: ${ALLOWED_RADIUS} meters`)
  console.log(
    `Calculated distance: ${calculateDistance(CAFE_LATITUDE, CAFE_LONGITUDE, Number(latitude), Number(longitude))} meters`,
  )

  return NextResponse.json({ token, expiresAt })
  */
}

function generateToken(): string {
  const timestamp = Date.now().toString()
  const hash = crypto.createHmac("sha256", SECRET_KEY).update(timestamp).digest("hex")
  return `${timestamp}.${hash}`
}

// Commented out location-related functions
/*
function checkLocation(latitude: number, longitude: number): boolean {
  const distance = calculateDistance(CAFE_LATITUDE, CAFE_LONGITUDE, latitude, longitude)
  console.log(`Calculated distance: ${distance} meters`)
  return distance <= ALLOWED_RADIUS
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}
*/

