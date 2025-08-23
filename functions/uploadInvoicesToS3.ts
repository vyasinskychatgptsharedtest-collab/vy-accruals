import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { SuccessResponse } from '../helpers/response';
import { Express } from 'express';

interface ConfigItem {
    id: number;
}

export const uploadInvoicesToS3 = async (
    prisma: PrismaClient,
    files: Express.Multer.File[],
    _config: ConfigItem[],
) => {
    const region = process.env.AWS_REGION as string;
    const bucket = process.env.S3_BUCKET as string;

    const s3 = new S3Client({ region });

    for (const file of files) {
        // Разделяем имя файла на accountExternalId и periodId
        const [accountExternalId, periodId] = file.originalname
            .replace('.pdf', '')
            .split('_')
            .map((part) => parseInt(part));

        // Сохраняем каждый инвойс в отдельную папку периода
        const key = `${periodId}/${accountExternalId}.pdf`;

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
    }

    return new SuccessResponse(true);
};

