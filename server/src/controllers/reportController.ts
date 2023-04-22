import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express';
import { Auth } from '../libs/auth';

const prisma = new PrismaClient();
const router = Router();

// GET: /report
router.get('/', Auth.verify, async (req: Request, res: Response) => {
  if (!req.userId) {
    await res.json({ msg: 'user is not specified' });
    return;
  }
  const year = req.body.year;
  const month = req.body.month;
  if (!year || !month) {
    await res.json({ msg: 'year or month is not specified' });
    return;
  }

  const report = await prisma.report.findMany({
    where: {
      date: {
        gte: new Date(`${year}-${month}-01`),
        lte: new Date(`${year}-${month}-31`),
      },
      userId: req.userId,
    },
  });
  await res.json(report);
});

// PUT: /report
router.put('/', async (req: Request, res: Response) => {
  const date = req.body.date;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const restTime = req.body.restTime;
  const report = req.body.report || '';
  const reportType = req.body.reportType || 'CHAT_GPT_WAITING';

  if (!date || !startTime || !endTime || !restTime) {
    await res.json({ msg: 'date, startTime, endTime or restTime is not specified' });
    return;
  }
});

// POST: /report/autocomplete
router.post('/autocomplete', async (req: Request, res: Response) => {
  const reportId = req.body.reportId;
});

export default router;
