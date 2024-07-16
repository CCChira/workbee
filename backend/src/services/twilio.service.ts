import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private twilioClient: Twilio;
  constructor(private configService: ConfigService) {
    const accountSid = configService.get('TWILIO_ACCOUNT_SID');
    const authToken = configService.get('TWILIO_AUTH_TOKEN');

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async sendInviteCodeSMS(phoneNumber: string, inviteCode: string) {
    const message = `Your invite code is: ${inviteCode}`;
    console.log('Sending SMS to', phoneNumber);

    console.log(this.configService.get('TWILIO_SENDER_PHONE_NUMBER'));
    return this.twilioClient.messages.create({
      body: message,
      from: this.configService.get('TWILIO_SENDER_PHONE_NUMBER'),
      to: `+4${phoneNumber}`,
    });
  }
}
