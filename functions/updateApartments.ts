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
        await prisma.$executeRaw`
            INSERT INTO apartments (
                apartment_external_id,
                address,
                description,
                unit_id,
                debt,
                invoice_disabled,
                must_confirm,
                gaz_type
            ) VALUES (
                ${item.id},
                ${item.address},
                ${item.description ?? null},
                ${item.unitId ?? null},
                ${item.debt ?? null},
                ${item.invoiceDisabled},
                ${item.mustConfirm},
                ${item.gazType}
            ) ON CONFLICT (apartment_external_id) DO NOTHING;
        `;
    }
    return new SuccessResponse();
};
