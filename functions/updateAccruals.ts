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
        await prisma.accrual.upsert({
            where: {
                // Используем правильный составной ключ с accountExternalId и periodId
                accountExternalId_periodId: {
                    accountExternalId: accrual.accountId,
                    periodId: accrual.periodId,
                },
            },
            update: {},
            create: {
                accountExternalId: accrual.accountId,
                periodName: accrual.periodName,
                periodId: accrual.periodId,
                inBalance: accrual.inBalance,
                totalSum: accrual.sum,
                fine: accrual.fine,
                toPay: accrual.toPay,
                payed: accrual.payed,
                invoiceExists: accrual.invoiceExists,
            },
        });
    }
    return new SuccessResponse();
};
