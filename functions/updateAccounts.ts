import { PrismaClient } from '@prisma/client';
import { SuccessResponse } from '../helpers/response';
import { UpdateDto } from '../helpers/types';
import { logger } from '../helpers/logger';

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
    try {
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
            logger.info(`Upserted account ${account.id}`);
        }
        return new SuccessResponse();
    } catch (error) {
        const message = (error as Error).message;
        logger.error(`updateAccounts: ${message}`);
        throw error;
    }
};
