import { PrismaClient } from '@prisma/client';
import { SuccessResponse } from '../helpers/response';
import { UpdateDto } from '../helpers/types';

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
    }
    return new SuccessResponse();
};
