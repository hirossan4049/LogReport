import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req: Request, res: Response) => {});

router.post('/create', async (req: Request, res: Response) => {
  const name = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!name || !email || !password) {
    res.json({ code: 400, msg: 'Please fill all the fields' });
    return;
  }

  const isExistAccount =
    (await prisma.user.findUnique({
      where: {
        email: email,
      },
    })) != null;

  if (isExistAccount) {
    res.json({ code: 400, msg: 'This email is already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
  });
});
