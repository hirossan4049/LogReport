import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { getConfig } from "./config";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

type TokenPayload = {
  userId: string;
};

export class Auth {
  static async generateToken(userId: string): Promise<string | undefined> {
    const expiresIn = (await getConfig("expiressIn")) ?? "1d";

    const payload: TokenPayload = {
      userId: userId,
    };

    const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
      expiresIn: expiresIn,
    });

    try {
      await prisma.authToken.create({
        data: {
          expiressIn: expiresIn,
          userId: userId,
          token: token,
          tokenType: "JWT",
        },
      });
      return token;
    } catch (e) {
      return undefined;
    }
  }

  static async verify(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      next();
      return;
    }

    const [bearer, bearerToken] = authHeader.split(" ");

    if (bearer !== "Bearer") {
      res.json({ error: "header format error: set bearer token!" });
      return;
    }

    try {
      const token = jwt.verify(bearerToken, process.env.JWT_TOKEN_SECRET) as TokenPayload;
      const isSuccess =
        (await prisma.authToken.findFirst({
          where: {
            userId: token.userId,
            token: bearerToken,
          },
        })) != null;

      if (isSuccess) {
        req.userId = token.userId;
        next();
      } else {
        res.json({ error: "token invalid" });
      }
    } catch (e) {
      console.error(e);
      if (e instanceof jwt.TokenExpiredError) {
        await Auth.destructionToken(bearerToken)
        res.json({ code: 3 });
      } else {
        res.json({ error: e });
      }
    }
  }

  static async destructionToken(token: string) {
    await prisma.authToken.deleteMany({
      where: {
        token: token,
      }
    })
  }
}