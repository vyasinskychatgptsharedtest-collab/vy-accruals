import { PrismaClient } from '@prisma/client';
import { SuccessResponse } from '../helpers/response';
import { UpdateDto } from '../helpers/types';
import { logger } from '../helpers/logger';

interface ParsingResult {
    parsingId: string;
    step: string;
    isSuccess: boolean;
    message: string;
}

export const createParsingResult = async (prisma: PrismaClient, body: UpdateDto<ParsingResult>) => {
    try {
        const { parsingId, step, isSuccess, message } = body.data;
        await prisma.parsingResult.create({
            data: {
                parsing: { connect: { id: parsingId } },
                step: { connect: { name: step } },
                isSuccess,
                message,
            },
        });
        logger.info(`Saved parsing result for parsing ${parsingId} at step ${step}`);
        return new SuccessResponse();
    } catch (error) {
        const errMsg = (error as Error).message;
        logger.error(`createParsingResult: ${errMsg}`);
        throw error;
    }
};
