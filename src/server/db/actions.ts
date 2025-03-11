"use server";

import { asc, desc, eq } from "drizzle-orm";
import { db } from "./index";
import { chat, message } from "./schema";
import { type Message } from "./types";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function getCurrentUser() {
  try {
    const user = await currentUser();
    return user;
  } catch (error) {
    console.error("Failed to get current user from database", error);
    throw error;
  }
}

export async function saveMessages({ messages }: { messages: Array<Message> }) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    console.error("Failed to save messages in database", error);
    throw error;
  }
}

export async function createNewChat() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not found");
  }
  try {
    return await db
      .insert(chat)
      .values({ userId: user.id, title: "New Journal" })
      .returning({ chatId: chat.id });
  } catch (e) {
    console.error("Failed to create new chat in database", e);
    throw e;
  }
}

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  try {
    return await db
      .insert(chat)
      .values({
        id,
        createdAt: new Date(),
        userId,
        title,
      })
      .returning({ chatId: chat.id });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    console.error("Failed to get messages by chat id from database", error);
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}

export async function getChatsByCurrentUserId() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }

  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, userId))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}
export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export const deleteChat = async (chatId: string) => {
  await db.delete(chat).where(eq(chat.id, chatId));
};

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    console.error("Failed to get message by id from database");
    throw error;
  }
}
