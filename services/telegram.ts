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

        let text = `🏢 Организация: ${invoice.account.organizationName}
🏠 Адрес: ${invoice.account.address}
📅 Период: ${invoice.periodName}\n
💰 Сумма к оплате: ${invoice.totalSum}
${invoice.fine && invoice.fine.toNumber() > 0 ? `⚠️ Штраф: ${invoice.fine.toNumber()}` : ''}
${invoice.inBalance ? `💳 Общая задолженность: ${invoice.inBalance.toNumber()}` : ''}`;

        if (
            invoice.inBalance &&
            invoice.totalSum &&
            invoice.inBalance.toNumber() > invoice.totalSum.toNumber()
        ) {
            text += `\n\n❗ Общая задолженность превышает сумму текущей квитанции`;
        }

        const sanitize = (value: string) => value.trim().replace(/\s+/g, '_');
        const organizationName = sanitize(invoice.account.organizationName);
        const periodName = sanitize(
            invoice.periodName ?? invoice.periodId.toString(),
        );
        const totalSum = invoice.totalSum?.toNumber() ?? 0;
        const fileName = `${organizationName}_${periodName}_${totalSum}.pdf`;

        const fetchFn = (globalThis as any).fetch as any;
        const fileResponse = await fetchFn(invoice.s3InvoiceUrl);
        const fileBuffer = await fileResponse.arrayBuffer();

        const url = `https://api.telegram.org/bot${token}/sendDocument`;

        const formData = new FormData();
        formData.append('chat_id', channelId);
        formData.append('caption', text);
        formData.append('document', new Blob([fileBuffer]), fileName);

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
