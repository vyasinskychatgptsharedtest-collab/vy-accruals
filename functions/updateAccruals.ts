import { PrismaClient } from '@prisma/client';
import { SuccessResponse } from '../helpers/response';
import { UpdateDto } from '../helpers/types';

interface ExternalAccrual {
    accountId: number;
    periodName: string;
    periodId: number;
    inBalance: number;
    sum: number;
    fine: number;
    toPay: number;
    payed: number;
    invoiceExists: boolean;
}

export const updateAccruals = async (prisma: PrismaClient, body: UpdateDto<ExternalAccrual[]>) => {
    for (const accrual of body.data) {
        await prisma.$executeRaw`
            INSERT INTO accruals (
                account_external_id,
                period_name,
                period_id,
                in_balance,
                total_sum,
                fine,
                to_pay,
                payed,
                invoice_exists
            ) VALUES (
                ${accrual.accountId},
                ${accrual.periodName},
                ${accrual.periodId},
                ${accrual.inBalance},
                ${accrual.sum},
                ${accrual.fine},
                ${accrual.toPay},
                ${accrual.payed},
                ${accrual.invoiceExists}
            ) ON CONFLICT DO NOTHING;
        `;
    }
    return new SuccessResponse();
};
