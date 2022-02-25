import * as React from "react";

import type { ShoppingItem } from "@prisma/client";
import { useRouter } from "next/router";

interface Props {
  item: Pick<ShoppingItem, "id" | "name" | "completed">;
}

export const ItemListItem: React.FC<Props> = ({ item }) => {
  const [itemName, setItemName] = React.useState(item.name);
  const [itemCompleted, setItemCompleted] = React.useState(item.completed);
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  const updateItem = (id: string, input: unknown) => {
    return fetch(`/api/items/${id}`, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  };

  const deleteItem = async (id: string) => {
    const response = await fetch(`/api/items/${id}`, {
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      refreshData();
    }
  };

  const updateItemName = () => {
    updateItem(item.id, { name: itemName }).then((res) => {
      if (!res.ok) {
        // if there's an error revert the change
        setItemName(item.name);
      }
    });
  };

  const updateItemChecked: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setItemCompleted(e.target.checked);
    updateItem(item.id, { completed: e.target.checked, name: itemName }).then(
      (res) => {
        if (!res.ok) {
          // if there's an error revert the checked state
          setItemCompleted(item.completed);
        }
      }
    );
  };

  const itemCheckedInputId = `item-checked-${item.id}`;
  const itemNameInputId = `item-name-${item.id}`;

  return (
    <li className="flex items-center">
      <div className="inline-flex w-4 h-4 mr-2 items-center justify-center">
        <label htmlFor={itemCheckedInputId} className="sr-only">
          Checked
        </label>
        <input
          id={itemCheckedInputId}
          type="checkbox"
          checked={!!itemCompleted}
          onChange={updateItemChecked}
          className="cursor-pointer w-auto"
        />
      </div>

      <label htmlFor={itemNameInputId} className="sr-only">
        Item name
      </label>
      <input
        id={itemNameInputId}
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        onBlur={updateItemName}
        className={`${!!itemCompleted ? "line-through" : ""} flex-grow mr-2`}
      />

      <button onClick={() => deleteItem(item.id)} title="Delete item">
        <i className="w-4 h-4 inline" /> D
      </button>
    </li>
  );
};
