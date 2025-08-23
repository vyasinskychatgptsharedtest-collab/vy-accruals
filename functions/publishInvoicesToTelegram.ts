import { PrismaClient } from '@prisma/client';
import { sendInvoiceToTelegram } from '../services/telegram';

export const publishInvoicesToTelegram = async (prisma: PrismaClient) => {
    const invoices = await prisma.accrual.findMany({
        where: { telegramPublished: false, s3InvoiceUrl: { not: null } },
        include: { account: true },
    });

    for (const invoice of invoices) {
        await sendInvoiceToTelegram(invoice);
        await prisma.accrual.update({
            where: { id: invoice.id },
            data: { telegramPublished: true },
        });
    }
};
