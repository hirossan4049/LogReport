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
router.put('/', Auth.verify, async (req: Request, res: Response) => {
  if (!req.userId) {
    await res.json({ msg: 'user is not specified' });
    return;
  }

  const date = req.body.date;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const restTime = Number(req.body.restTime);
  const report = req.body.report || '';
  const reportType = req.body.reportType || 'CHAT_GPT_WAITING';

  if (!date || !startTime || !endTime || !restTime) {
    await res.json({ msg: 'date, startTime, endTime or restTime is not specified' });
    return;
  }

  try {
    await prisma.report.upsert({
      where: {
        report_unique: {
          userId: req.userId,
          date: new Date(date),
        },
      },
      update: {
        startTime: startTime,
        endTime: endTime,
        restTime: restTime,
        report: report,
        reportType: reportType,
      },
      create: {
        userId: req.userId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        restTime: restTime,
        report: report,
        reportType: reportType,
      },
    });
    await res.json({ msg: 'success' });
  } catch (e) {
    console.error(e)
    await res.json({ msg: 'error' });
  }
});

// POST: /report/autocomplete
router.post('/autocomplete', async (req: Request, res: Response) => {
  const reportId = req.body.reportId;
});

export default router;
