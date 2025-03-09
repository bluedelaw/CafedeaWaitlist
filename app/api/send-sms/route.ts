import { NextResponse } from "next/server"
import { SendMessagesCommand } from "@aws-sdk/client-pinpoint"
import { pinpointClient } from "@/aws-config"
import { parsePhoneNumberFromString } from "libphonenumber-js"

export async function POST(req: Request) {
  try {
    const { phoneNumber, message } = await req.json()

    const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, "US")

    if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
      return NextResponse.json({ success: false, message: "Invalid phone number" }, { status: 400 })
    }

    const formattedPhoneNumber = parsedPhoneNumber.format("E.164")

    const params = {
      ApplicationId: process.env.AWS_PINPOINT_APP_ID,
      MessageRequest: {
        Addresses: {
          [formattedPhoneNumber]: { ChannelType: "SMS" },
        },
        MessageConfiguration: {
          SMSMessage: {
            Body: message,
            MessageType: "TRANSACTIONAL",
          },
        },
      },
    }

    console.log("Sending SMS with params:", JSON.stringify(params, null, 2))

    const command = new SendMessagesCommand(params)
    const response = await pinpointClient.send(command)

    console.log("Pinpoint response:", JSON.stringify(response, null, 2))

    if (response.MessageResponse?.Result?.[formattedPhoneNumber]?.StatusCode === 200) {
      return NextResponse.json({ success: true, result: response.MessageResponse.Result })
    } else {
      const errorMessage = response.MessageResponse?.Result?.[formattedPhoneNumber]?.StatusMessage || "Unknown error"
      return NextResponse.json({ success: false, message: `Failed to send SMS: ${errorMessage}` }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Error sending SMS:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Error sending SMS: ${error.message || "Unknown error"}`,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

