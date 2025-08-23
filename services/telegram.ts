import { Accrual, Account } from '@prisma/client';

interface Invoice extends Accrual {
    account: Account;
}

export const sendInvoiceToTelegram = async (invoice: Invoice) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;

    if (!token || !channelId) {
        return;
    }

    const text = `Период: ${invoice.periodName}\nСумма: ${invoice.toPay}\nАдрес: ${invoice.account.address}\nСсылка: ${invoice.s3InvoiceUrl}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const body = new URLSearchParams({ chat_id: channelId, text });

    const fetchFn = (globalThis as any).fetch as any;
    await fetchFn(url, { method: 'POST', body });
};
