import express from "express";

const app = express();

app.use(express.json());

// app.use("/user", )

app.get("/", async (_, res) => {
  await res.json({ msg: "hello root!" });
});

export default app;
