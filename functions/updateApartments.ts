import { PrismaClient } from '@prisma/client';
import { SuccessResponse } from '../helpers/response';
import { UpdateDto } from '../helpers/types';
import { logger } from '../helpers/logger';

interface ExternalApartment {
    id: number;
    address: string;
    description: string;
    unitId: string;
    debt: number;
    isConfirmed: boolean;
    invoiceDisabled: boolean;
    mustConfirm: boolean;
    gazType: number;
}

export const updateApartments = async (prisma: PrismaClient, body: UpdateDto<ExternalApartment[]>) => {
    try {
        for (const item of body.data) {
            await prisma.apartment.upsert({
                where: { apartmentExternalId: item.id },
                update: {},
                create: {
                    apartmentExternalId: item.id,
                    address: item.address,
                    description: item.description ?? null,
                    unitId: item.unitId ?? null,
                    debt: item.debt ?? null,
                    invoiceDisabled: item.invoiceDisabled,
                    mustConfirm: item.mustConfirm,
                    gazType: item.gazType,
                },
            });
            logger.info(`Upserted apartment ${item.id}`);
        }
        return new SuccessResponse();
    } catch (error) {
        const message = (error as Error).message;
        logger.error(`updateApartments: ${message}`);
        throw error;
    }
};
