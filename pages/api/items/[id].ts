import type { NextApiHandler } from "next";
import { db } from "../../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "DELETE") {
    const id = req.query.id as string;

    const item = await db.shoppingItem.delete({ where: { id } });
    res.status(200).json({ data: item });
    return;
  }

  if (req.method === "PUT") {
    const id = req.query.id as string;
    const body = req.body;

    const item = await db.shoppingItem.update({ where: { id }, data: body });

    res.status(200).json({ data: item });
    return;
  }

  res.status(400).send(`Unsupported method ${req.method}`);
};

export default handler;
