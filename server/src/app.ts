import express from 'express';
import userController from './controllers/userController';
import { Auth } from './libs/auth';

const app = express();

app.use(express.json());

app.use('/user', userController);

app.get('/', Auth.verify, async (req, res) => {
  if (req.userId) {
    await res.json({ msg: `hello ${req.userId}` });
  } else {
    await res.json({ msg: 'hello root!' });
  }
});

export default app;
