import { PrismaClient } from '@prisma/client';
import { SuccessResponse } from '../helpers/response';

export const getMissingInvoices = async (prisma: PrismaClient) => {
    const result = await prisma.$queryRaw<any[]>`
        SELECT id, account_external_id, period_id FROM accruals
        WHERE invoice_exists = TRUE AND s3_invoice_url IS NULL;
    `;
    return new SuccessResponse(result);
};
