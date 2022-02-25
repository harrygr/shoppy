import { ShoppingItem } from "@prisma/client";
import * as React from "react";
import { ItemInput } from "./ItemInput";
import { ItemListItem } from "./ItemListItem";

interface Props {
  items: Pick<ShoppingItem, "id" | "name" | "completed">[];
}

export const ShoppingList: React.FC<Props> = ({ items }) => {
  return (
    <div>
      <ul>
        {items.map((item) => (
          <ItemListItem item={item} key={item.id} />
        ))}
      </ul>

      <ItemInput />
    </div>
  );
};
