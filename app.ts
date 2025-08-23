import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createParsing } from './functions/createParsing';
import { updateApartments } from './functions/updateApartments';
import { updateAccounts } from './functions/updateAccounts';
import { updateAccruals } from './functions/updateAccruals';
import { createParsingResult } from './functions/createParsingResult';
import { getMissingInvoices } from './functions/getMissingInvoices';
import { uploadInvoicesToS3 } from './functions/uploadInvoicesToS3';
import { ErrorResponse } from './helpers/response';
import cors from 'cors';
import multer from 'multer';
import { publishInvoicesToTelegram } from './functions/publishInvoicesToTelegram';
import { logger } from './helpers/logger';

const app = express();
// Разрешаем CORS для всех доменов или указываем конкретный домен
app.use(cors({
    origin: 'https://xn--j1ab.xn--80aaaf3bi1ahsd.xn--80asehdb',  // Указать точный источник
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const prisma = new PrismaClient();

app.post('/createParsing', async (_req: Request, res: Response) => {
    try {
        const response = await createParsing(prisma);
        res.json(response);
    } catch (error) {
        const message = (error as Error).message;
        logger.error(`createParsing: ${message}`);
        res.status(500).json(new ErrorResponse(message));
    }
});

app.post('/updateApartments', async (req: Request, res: Response) => {
    try {
        const response = await updateApartments(prisma, req.body);
        res.json(response);
    } catch (error) {
        const message = (error as Error).message;
        logger.error(`updateApartments: ${message}`);
        res.status(500).json(new ErrorResponse(message));
    }
});

app.post('/updateAccounts', async (req: Request, res: Response) => {
    try {
        const response = await updateAccounts(prisma, req.body);
        res.json(response);
    } catch (error) {
        const message = (error as Error).message;
        logger.error(`updateAccounts: ${message}`);
        res.status(500).json(new ErrorResponse(message));
    }
});

app.post('/updateAccruals', async (req: Request, res: Response) => {
    try {
        const response = await updateAccruals(prisma, req.body);
        res.json(response);
    } catch (error) {
        const message = (error as Error).message;
        logger.error(`updateAccruals: ${message}`);
        res.status(500).json(new ErrorResponse(message));
    }
});

app.post('/createParsingResult', async (req: Request, res: Response) => {
    try {
        const response = await createParsingResult(prisma, req.body);
        res.json(response);
    } catch (error) {
        const message = (error as Error).message;
        logger.error(`createParsingResult: ${message}`);
        res.status(500).json(new ErrorResponse(message));
    }
});

app.get('/getMissingInvoices', async (_req: Request, res: Response) => {
    try {
        const response = await getMissingInvoices(prisma);
        res.json(response);
    } catch (error) {
        const message = (error as Error).message;
        logger.error(`getMissingInvoices: ${message}`);
        res.status(500).json(new ErrorResponse(message));
    }
});

app.post('/uploadInvoicesToS3', upload.array('pdfFile'), async (req: Request, res: Response) => {
    try {
        const config = req.body.config ? JSON.parse(req.body.config) : [];
        const files = req.files as Express.Multer.File[];
        const response = await uploadInvoicesToS3(prisma, files, config);
        await publishInvoicesToTelegram(prisma);
        res.json(response);
    } catch (error) {
        const message = (error as Error).message;
        logger.error(`uploadInvoicesToS3: ${message}`);
        res.status(500).json(new ErrorResponse(message));
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});

