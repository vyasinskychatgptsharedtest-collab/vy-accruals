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

        const sanitizeFileName = (name: string) =>
            name.replace(/[\r\n\\/\?:*"'<>|]+/g, '').trim();

        const fileName = `${sanitizeFileName(invoice.account.organizationName)} ${sanitizeFileName(invoice.periodName || '')}.pdf`;
        const delimiter = invoice.s3InvoiceUrl.includes('?') ? '&' : '?';
        const documentUrl = `${invoice.s3InvoiceUrl}${delimiter}response-content-disposition=${encodeURIComponent(
            `attachment; filename="${fileName}"`,
        )}`;

        let text = `🏢 Организация: ${invoice.account.organizationName}
🏠 Адрес: ${invoice.account.address}
📅 Период: ${invoice.periodName}\n
💰 Сумма к оплате: ${invoice.totalSum}
${invoice.fine && invoice.fine.toNumber() > 0 ? `⚠️ Штраф: ${invoice.fine.toNumber()}` : ''}
${invoice.inBalance ? `💳 Общая задолженность: ${invoice.inBalance.toNumber()}` : ''}`;

if (invoice.inBalance && invoice.totalSum && invoice.inBalance.toNumber() > invoice.totalSum.toNumber()) {
    text += `\n\n❗ Общая задолженность превышает сумму текущей квитанции`;
}

        const url = `https://api.telegram.org/bot${token}/sendDocument`;

        const formData = new FormData();
        formData.append('chat_id', channelId);
        formData.append('caption', text);
        formData.append('document', documentUrl);

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
