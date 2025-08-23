import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { SuccessResponse } from '../helpers/response';
import { Express } from 'express';
import { logger } from '../helpers/logger';

interface ConfigItem {
    id: number;
}

export const uploadInvoicesToS3 = async (
    prisma: PrismaClient,
    files: Express.Multer.File[],
    _config: ConfigItem[],
) => {
    try {
        const region = process.env.AWS_REGION as string;
        const bucket = process.env.S3_BUCKET as string;

        const s3 = new S3Client({ region });

        for (const file of files) {
            // Разделяем имя файла на accountExternalId и periodId
            const [accountExternalId, periodId] = file.originalname
                .replace('.pdf', '')
                .split('_')
                .map((part) => parseInt(part));

            // Получаем информацию по начислению для формирования имени файла
            const invoice = await prisma.accrual.findUnique({
                where: {
                    accountExternalId_periodId: {
                        accountExternalId,
                        periodId,
                    },
                },
                include: { account: true },
            });

            if (!invoice) {
                logger.error(
                    `Invoice not found for account ${accountExternalId} period ${periodId}`,
                );
                continue;
            }

            const sanitize = (value: string) =>
                value.trim().replace(/\s+/g, '_');

            const organizationName = sanitize(invoice.account.organizationName);
            const periodName = sanitize(invoice.periodName ?? periodId.toString());
            const totalSum = invoice.totalSum?.toNumber() ?? 0;

            // Сохраняем каждый инвойс в отдельную папку периода
            const key = `${periodId}/${organizationName}_${periodName}_${totalSum}.pdf`;

            // Загружаем файл в S3
            await s3.send(
                new PutObjectCommand({
                    Bucket: bucket,
                    Key: key,
                    Body: file.buffer,
                    ContentType: 'application/pdf',
                }),
            );

            const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

            // Обновляем таблицу по accountExternalId и periodId
            await prisma.accrual.update({
                where: {
                    accountExternalId_periodId: {
                        accountExternalId,
                        periodId,
                    },
                },
                data: { s3InvoiceUrl: url },
            });
            logger.info(`Saved invoice for account ${accountExternalId} period ${periodId}`);
        }

        return new SuccessResponse(true);
    } catch (error) {
        const message = (error as Error).message;
        logger.error(`uploadInvoicesToS3: ${message}`);
        throw error;
    }
};

