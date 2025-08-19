import { PrismaClient } from '@prisma/client';
import { SuccessResponse } from '../helpers/response';
import { UpdateDto } from '../helpers/types';

interface ParsingResult {
    parsingId: number;
    step: string;
    isSuccess: boolean;
    message: string;
}

export const updateParsingResult = async (prisma: PrismaClient, body: UpdateDto<ParsingResult>) => {
    const { parsingId, step, isSuccess, message } = body.data;

    await prisma.$executeRaw`
        INSERT INTO parsing_results (parsing_id, step_id, is_success, message)
        VALUES (
            ${parsingId},
            (SELECT id FROM steps WHERE name = ${step}),
            ${isSuccess},
            ${message}
        );
    `;
    return new SuccessResponse();
};
