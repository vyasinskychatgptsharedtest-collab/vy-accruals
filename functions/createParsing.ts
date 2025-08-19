import { PrismaClient } from '@prisma/client';
import { SuccessResponse } from '../helpers/response';

export const createParsing = async (prisma: PrismaClient) => {
    const result = await prisma.$queryRaw<{ id: number }[]>`SELECT create_parsing() as id`;
    const newId = result[0]?.id;
    return new SuccessResponse({ id: newId });
};
