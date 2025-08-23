import { PrismaClient } from '@prisma/client';
import { SuccessResponse } from '../helpers/response';
import { logger } from '../helpers/logger';

export const getMissingInvoices = async (prisma: PrismaClient) => {
    try {
        const result = await prisma.accrual.findMany({
            where: { invoiceExists: true, s3InvoiceUrl: null },
            select: { id: true, accountExternalId: true, periodId: true },
        });
        logger.info(`Retrieved ${result.length} invoices missing from storage`);
        return new SuccessResponse(result);
    } catch (error) {
        const message = (error as Error).message;
        logger.error(`getMissingInvoices: ${message}`);
        throw error;
    }
};
