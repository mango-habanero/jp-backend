import { config } from '../config';
import { InternalServerError } from '../core/errors';

export async function sendEmail(to: string, subject: string, text: string) {
    const emailData = {
        to,
        from: config.EMAIL_ENGINE.SENDER,
        subject,
        text,
    };

    try {
        const response = await fetch(`${config.EMAIL_ENGINE.API_URL}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${config.EMAIL_ENGINE.API_KEY}`,
            },
            body: JSON.stringify(emailData),
        });

        if (!response.ok) {
            throw new InternalServerError(`Error sending email: ${response.statusText}`);
        }
    } catch (error) {
        throw new InternalServerError('Error sending email');
    }
}
