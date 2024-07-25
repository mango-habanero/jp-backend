import { config } from '@/config';
import { InternalServerError } from '@/core/errors';
import { logger } from '@/core/logger';

export async function sendEmail(to: string, subject: string, text: string): Promise<void> {
    const {
        EMAIL_ENGINE: { SENDER, API_URL, API_KEY },
    } = config;

    if (!SENDER || !API_URL || !API_KEY) {
        throw new InternalServerError('Email configuration is missing or invalid');
    }
    const emailData = { to, from: SENDER, subject, text };

    try {
        const response = await fetch(`${API_URL}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify(emailData),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            logger.error(
                `Error sending email: ${response.statusText} - ${JSON.stringify(errorBody)}`,
            );
            throw new InternalServerError(`Error sending email: ${response.statusText}`);
        }

        logger.info(`Email sent successfully to ${to}`);
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error sending email: ${error.message}`, { stack: error.stack });
        }
        throw new InternalServerError('Error sending email');
    }
}
