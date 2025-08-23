import { PrismaClient } from '@prisma/client';
import { SuccessResponse } from '../helpers/response';
import { logger } from '../helpers/logger';

export const createParsing = async (prisma: PrismaClient) => {
    try {
        const parsing = await prisma.parsing.create({ data: {} });
        logger.info(`Created parsing with id ${parsing.id}`);
        return new SuccessResponse({ id: parsing.id });
    } catch (error) {
        const message = (error as Error).message;
        logger.error(`createParsing: ${message}`);
        throw error;
    }
};
