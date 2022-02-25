import type { NextApiHandler } from "next";
import { db } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const body = req.body;
    const item = await db.shoppingItem.create({
      data: { name: body.name, completed: false },
    });
    res.status(200).json({ data: item });
  }
};

export default handler;
