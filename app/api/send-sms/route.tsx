import AWS from 'aws-sdk';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export async function POST(req: Request) {
  try {
    const { phoneNumber, message } = await req.json();

    // Format phone number to E.164 format (assuming US/Canada for this example)
    const formattedPhoneNumber = parsePhoneNumberFromString(phoneNumber, 'US')?.format('E.164');

    if (!formattedPhoneNumber) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid phone number' }), { status: 400 });
    }

    // Initialize AWS SNS service
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const sns = new AWS.SNS();

    // Setup parameters for SMS
    const params = {
      Message: message,   // The SMS message to send
      PhoneNumber: formattedPhoneNumber, // The formatted phone number
    };

    // Send SMS
    const result = await sns.publish(params).promise();

    // Return success response
    return new Response(JSON.stringify({ success: true, result }), { status: 200 });
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
