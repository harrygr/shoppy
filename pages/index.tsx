import { ShoppingItem } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import React from "react";
import { ItemInput } from "../components/ItemInput";
import { ItemListItem } from "../components/ItemListItem";
import { db } from "../lib/db";
import styles from "../styles/Home.module.css";

interface ServerProps {
  items: Pick<ShoppingItem, "id" | "name" | "completed">[];
}

export const getServerSideProps: GetServerSideProps<ServerProps> = async () => {
  const items = await db.shoppingItem.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, completed: true },
  });

  return {
    props: {
      items,
    },
  };
};

const Home: NextPage<ServerProps> = ({ items }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Shoppy</title>

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Shoppy</h1>

        <ul>
          {items.map((item) => (
            <ItemListItem item={item} key={item.id} />
          ))}
        </ul>

        <ItemInput />
      </main>
    </div>
  );
};

export default Home;
