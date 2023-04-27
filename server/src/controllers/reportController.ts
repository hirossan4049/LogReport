import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express';
import { Auth } from '../libs/auth';
import { getReport } from '../libs/getReport';
import { Code } from '../types/responseCode';

const prisma = new PrismaClient();
const router = Router();

// GET: /report
router.get('/', Auth.verify, async (req: Request, res: Response) => {
  if (!req.userId) {
    await res.json({ code: Code.NotUserSpecified, msg: 'user is not specified' });
    return;
  }
  const year = req.query.year;
  const month = req.query.month;
  if (!year || !month) {
    await res.json({ code: Code.NotFieldsSpecified, msg: 'year or month is not specified' });
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
  await res.json({ code: Code.Success, msg: 'success', data: report });
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
  const report = req.body.report ?? '';
  const reportType = report.length > 0 ? 'CUSTOM' : req.body.reportType || 'CHAT_GPT_WAITING';

  if (!date || !startTime || !endTime || (restTime == undefined)) {
    await res.json({ msg: 'date, startTime, endTime or restTime is not specified' });
    return;
  }

  try {
    const newReport = await prisma.report.upsert({
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
    await res.json({ code: Code.Success, msg: 'success', data: newReport });
  } catch (e) {
    console.error(e);
    await res.json({ code: Code.InternalServerError, msg: 'error', data: null });
  }
});

// POST: /report/autocomplete
router.post('/autocomplete', Auth.verify, async (req: Request, res: Response) => {
  if (!req.userId) {
    await res.json({ msg: 'user is not specified' });
    return;
  }

  const reportId = req.body.reportId;

  if (!reportId) {
    await res.json({ msg: 'reportId is not specified' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });
    if (!user) {
      await res.json({ msg: 'user is not found' });
      return;
    }
    if (!user.watchRepository) {
      await res.json({ msg: 'watchRepository is not found' });
      return;
    }

    const report = await prisma.report.findUnique({
      where: {
        id: reportId,
      },
    });
    if (!report) {
      await res.json({ msg: 'report is not found' });
      return;
    }

    // TODO: waitlist
    const gpt_report = await getReport(user.watchRepository, 'hirossan4049', report.startTime, report.endTime);
    const new_report = await prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        report: gpt_report,
        reportType: 'CHAT_GPT_COMPLETE',
      },
    });
    await res.json({ code: Code.Success, msg: 'success', data: new_report });
  } catch (e) {
    console.error(e);
    await res.json({ msg: 'error' });
  }
});

export default router;
