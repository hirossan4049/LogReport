import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import { Auth } from '../libs/auth';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req: Request, res: Response) => {});

// POST: /user/create
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

  try {
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });
    const token = await Auth.generateToken(user.id);
    res.json({ code: 200, msg: 'Success', token: token });
  } catch (e) {
    res.json({ code: 500, msg: 'Internal Server Error' });
  }
});

// POST: /user/login
router.post('/login', async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.json({ code: 400, msg: 'Please fill all the fields' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    res.json({ code: 400, msg: 'This email is not registered' });
    return;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    res.json({ code: 400, msg: 'Invalid password' });
    return;
  }

  const token = await Auth.generateToken(user.id);
  res.json({ code: 200, msg: 'Success', token: token });
});

export default router;
