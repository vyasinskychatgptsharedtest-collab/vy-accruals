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
        await prisma.$executeRaw`
            INSERT INTO accounts (
                account_external_id,
                organization_name,
                organization_id,
                address,
                type,
                debt,
                apartment_id
            ) VALUES (
                ${account.id},
                ${account.organizationName},
                ${account.organizationId},
                ${account.address},
                ${account.type},
                ${account.debt},
                ${account.apartmentId}
            ) ON CONFLICT (account_external_id) DO NOTHING;
        `;
    }
    return new SuccessResponse();
};
