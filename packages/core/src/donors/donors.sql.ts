import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { Drizzle } from "../shared/drizzle";

export const donorsTable = pgTable("animal", {
  ...Drizzle.id,
  ...Drizzle.timestamps,
  ...Drizzle.isActive,
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 612 }),
 // vaccineDate: timestamp(),
});
