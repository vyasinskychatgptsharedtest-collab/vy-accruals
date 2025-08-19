import { PrismaClient } from '@prisma/client';
import { SuccessResponse } from '../helpers/response';

export const getMissingInvoices = async (prisma: PrismaClient) => {
    const result = await prisma.accrual.findMany({
        where: { invoiceExists: true, s3InvoiceUrl: null },
        select: { id: true, accountExternalId: true, periodId: true },
    });
    return new SuccessResponse(result);
};
