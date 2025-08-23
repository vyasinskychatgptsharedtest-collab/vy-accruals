import { Accrual, Account } from '@prisma/client';
import { logger } from '../helpers/logger';

interface Invoice extends Accrual {
    account: Account;
}

export const sendInvoiceToTelegram = async (invoice: Invoice) => {
    try {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const channelId = process.env.TELEGRAM_CHANNEL_ID;

        if (!token || !channelId || !invoice.s3InvoiceUrl) {
            return;
        }

        const text = `Период: ${invoice.periodName}\nСумма: ${invoice.toPay}\nАдрес: ${invoice.account.address}`;

        const url = `https://api.telegram.org/bot${token}/sendDocument`;

        const formData = new FormData();
        formData.append('chat_id', channelId);
        formData.append('caption', text);
        formData.append('document', invoice.s3InvoiceUrl);

        const fetchFn = (globalThis as any).fetch as any;
        await fetchFn(url, {
            method: 'POST',
            body: formData,
        });
    } catch (error) {
        const message = (error as Error).message;
        logger.error(`sendInvoiceToTelegram: ${message}`);
        throw error;
    }
};
