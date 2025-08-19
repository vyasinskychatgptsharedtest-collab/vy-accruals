import { PrismaClient } from '@prisma/client';
import { SuccessResponse } from '../helpers/response';

export const createParsing = async (prisma: PrismaClient) => {
    const parsing = await prisma.parsing.create({ data: {} });
    return new SuccessResponse({ id: parsing.id });
};
