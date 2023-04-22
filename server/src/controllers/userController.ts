import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";

const prosma = new PrismaClient()
const router = Router()

router.get("/", async (req: Request, res: Response) => {
    
})