import { PrismaClient } from '@prisma/client';
import { SuccessResponse } from '../helpers/response';
import { UpdateDto } from '../helpers/types';

interface ParsingResult {
    parsingId: string;
    step: string;
    isSuccess: boolean;
    message: string;
}

export const createParsingResult = async (prisma: PrismaClient, body: UpdateDto<ParsingResult>) => {
    const { parsingId, step, isSuccess, message } = body.data;
    await prisma.parsingResult.create({
        data: {
            parsing: { connect: { id: parsingId } },
            step: { connect: { name: step } },
            isSuccess,
            message,
        },
    });
    return new SuccessResponse();
};
