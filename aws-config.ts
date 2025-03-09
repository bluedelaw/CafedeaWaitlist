import { PinpointClient } from "@aws-sdk/client-pinpoint"

console.log("Initializing Pinpoint client with region:", process.env.AWS_REGION)

const pinpointClient = new PinpointClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

console.log("Pinpoint client initialized")

export { pinpointClient }

