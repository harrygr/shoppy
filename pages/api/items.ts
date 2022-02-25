import type { NextApiHandler } from "next";
import { db } from "../../lib/db";
import * as t from "io-ts";
import * as E from "fp-ts/Either";
import { formatValidationErrors } from "io-ts-reporters";
import { pipe } from "fp-ts/lib/function";

const CreateShoppingItemInput = t.type({
  name: t.string,
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const input = pipe(
      req.body,
      CreateShoppingItemInput.decode,
      E.mapLeft(formatValidationErrors)
    );

    if (E.isLeft(input)) {
      res.status(422).json({ errors: input.left });
      return;
    }

    const item = await db.shoppingItem.create({
      data: { name: input.right.name, completed: false },
    });
    res.status(201).json({ data: item });
    return;
  }

  res.status(405).send(`Unsupported method ${req.method}`);
};

export default handler;
