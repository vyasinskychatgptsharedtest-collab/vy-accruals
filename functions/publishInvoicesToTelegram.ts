import { PrismaClient } from '@prisma/client';
import { sendInvoiceToTelegram } from '../services/telegram';
import { logger } from '../helpers/logger';

export const publishInvoicesToTelegram = async (prisma: PrismaClient) => {
    try {
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
    } catch (error) {
        const message = (error as Error).message;
        logger.error(`publishInvoicesToTelegram: ${message}`);
        throw error;
    }
};
