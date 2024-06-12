import { ConfigService } from '@nestjs/config';
export declare class TwilioService {
    private configService;
    private twilioClient;
    constructor(configService: ConfigService);
    sendInviteCodeSMS(phoneNumber: string, inviteCode: string): Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance>;
}
