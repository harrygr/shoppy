import type { NextApiHandler } from "next";
import { db } from "../../../lib/db";
import * as t from "io-ts";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { formatValidationErrors } from "io-ts-reporters";

const UpdateShoppingItemInput = t.partial({
  name: t.string,
  completed: t.boolean,
});

const handler: NextApiHandler = async (req, res) => {
  const id = req.query.id;

  if (typeof id !== "string") {
    res.status(400).send("Invalid request");
    return;
  }

  if (req.method === "DELETE") {
    const item = await db.shoppingItem.delete({ where: { id } });
    res.status(200).json({ data: item });
    return;
  }

  if (req.method === "PUT") {
    const input = pipe(
      req.body,
      UpdateShoppingItemInput.decode,
      E.mapLeft(formatValidationErrors)
    );

    if (E.isLeft(input)) {
      res.status(422).json({ errors: input.left });
      return;
    }

    const item = await db.shoppingItem.update({
      where: { id },
      data: input.right,
    });

    res.status(200).json({ data: item });
    return;
  }

  res.status(405).send(`Unsupported method ${req.method}`);
};

export default handler;
