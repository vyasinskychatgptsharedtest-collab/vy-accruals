import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createParsing } from './functions/createParsing';
import { updateApartments } from './functions/updateApartments';
import { updateAccounts } from './functions/updateAccounts';
import { updateAccruals } from './functions/updateAccruals';
import { createParsingResult } from './functions/createParsingResult';
import { getMissingInvoices } from './functions/getMissingInvoices';
import { ErrorResponse } from './helpers/response';
import cors from 'cors';

const app = express();
// Разрешаем CORS для всех доменов или указываем конкретный домен
app.use(cors({
    origin: 'https://xn--j1ab.xn--80aaaf3bi1ahsd.xn--80asehdb',  // Указать точный источник
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const prisma = new PrismaClient();

app.post('/createParsing', async (_req: Request, res: Response) => {
    try {
        const response = await createParsing(prisma);
        res.json(response);
    } catch (error) {
        res.status(500).json(new ErrorResponse((error as Error).message));
    }
});

app.post('/updateApartments', async (req: Request, res: Response) => {
    try {
        const response = await updateApartments(prisma, req.body);
        res.json(response);
    } catch (error) {
        res.status(500).json(new ErrorResponse((error as Error).message));
    }
});

app.post('/updateAccounts', async (req: Request, res: Response) => {
    try {
        const response = await updateAccounts(prisma, req.body);
        res.json(response);
    } catch (error) {
        res.status(500).json(new ErrorResponse((error as Error).message));
    }
});

app.post('/updateAccruals', async (req: Request, res: Response) => {
    try {
        const response = await updateAccruals(prisma, req.body);
        res.json(response);
    } catch (error) {
        res.status(500).json(new ErrorResponse((error as Error).message));
    }
});

app.post('/createParsingResult', async (req: Request, res: Response) => {
    try {
        const response = await createParsingResult(prisma, req.body);
        res.json(response);
    } catch (error) {
        res.status(500).json(new ErrorResponse((error as Error).message));
    }
});

app.get('/getMissingInvoices', async (_req: Request, res: Response) => {
    try {
        const response = await getMissingInvoices(prisma);
        res.json(response);
    } catch (error) {
        res.status(500).json(new ErrorResponse((error as Error).message));
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

