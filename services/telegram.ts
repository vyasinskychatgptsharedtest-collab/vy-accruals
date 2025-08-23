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

        // Формируем основное сообщение
        let text = `🏢 Организация: ${invoice.account.organizationName}
🏠 Адрес: ${invoice.account.address}
📅 Период: ${invoice.periodName}\n
💰 Сумма к оплате: ${invoice.totalSum}руб.`;

        // Добавляем штраф, если он есть
        if (invoice.fine && invoice.fine.toNumber() > 0) {
            text += `\n⚠️ Штраф: ${invoice.fine.toNumber()}руб.`;
        }

        // Добавляем общую задолженность, если она есть
        if (invoice.inBalance) {
            text += `\n💳 Общая задолженность: ${invoice.inBalance.toNumber()}руб.`;
        }

        // Проверяем, если задолженность больше суммы счета
        if (
            invoice.inBalance &&
            invoice.totalSum &&
            invoice.inBalance.toNumber() > invoice.totalSum.toNumber()
        ) {
            text += `\n\n❗ Общая задолженность превышает сумму текущей квитанции`;
        }

        // Сохраняем файл с корректным именем
        const sanitize = (value: string) => value.trim().replace(/\s+/g, '_');
        const organizationName = sanitize(invoice.account.organizationName);
        const periodName = sanitize(invoice.periodName ?? invoice.periodId.toString());
        const totalSum = invoice.totalSum?.toNumber() ?? 0;
        const fileName = `${organizationName}_${periodName}_${totalSum}руб.pdf`;

        const fetchFn = (globalThis as any).fetch as any;
        const fileResponse = await fetchFn(invoice.s3InvoiceUrl);
        const fileBuffer = await fileResponse.arrayBuffer();

        const url = `https://api.telegram.org/bot${token}/sendDocument`;

        const formData = new FormData();
        formData.append('chat_id', channelId);
        formData.append('caption', text);
        formData.append('document', new Blob([fileBuffer]), fileName);

        // Отправляем запрос
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
