import { PrismaClient } from '@prisma/client';
import { SuccessResponse } from '../helpers/response';
import { UpdateDto } from '../helpers/types';

interface ExternalAccount {
    id: number;
    organizationName: string;
    organizationId: string;
    address: string;
    type: string;
    debt: number;
    apartmentId: number;
}

export const updateAccounts = async (prisma: PrismaClient, body: UpdateDto<ExternalAccount[]>) => {
    for (const account of body.data) {
        await prisma.account.upsert({
            where: { accountExternalId: account.id },
            update: {},
            create: {
                accountExternalId: account.id,
                organizationName: account.organizationName,
                organizationId: account.organizationId,
                address: account.address,
                type: account.type,
                debt: account.debt,
                apartmentId: account.apartmentId,
            },
        });
    }
    return new SuccessResponse();
};
