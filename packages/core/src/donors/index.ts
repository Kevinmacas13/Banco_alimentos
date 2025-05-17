import { z } from "zod";
import { Common } from "../shared/common";
import { Examples } from "../examples";
import { Drizzle } from "../shared/drizzle";
import { donorsTable } from "./donors.sql";
import { and, eq } from "drizzle-orm";
import { fn } from "../shared/fn";
import { createID } from "../shared/id";

export namespace Animal {
  export const InfoSchema = z
    .object({
      id: z.string().openapi({
        description: Common.IdDescription,
        example: Examples.Animal.id,
      }),
      name: z.string().openapi({
        description: "Name of the Animal.",
        example: Examples.Animal.name,
      }),
      description: z.string().openapi({
        description: "Description of the Animal.",
        example: Examples.Animal.description,
      }),
      image: z.string().url().nullish().openapi({
        description: "URL of the Animal image.",
        example: Examples.Animal.image,
      }),
      // vaccineDate: z
      //   .union([z.string().transform((val) => new Date(val)), z.null()])
      //   //z.date().nullable()
      //   .openapi({
      //     description: "Date of the Animal vaccine.",
      //     example: Examples.Animal.vaccineDate,
      //   }),
    })
    .openapi({
      ref: "Animal",
      description: "A collection of cards with a theme or purpose.",
      example: Examples.Animal,
    });

  export type InfoType = z.infer<typeof InfoSchema>;

  function serialize(input: typeof donorsTable.$inferSelect): InfoType {
    return {
      id: input.id,
      name: input.name,
      description: input.description,
      image: input.image,
      //vaccineDate: input.vaccineDate,
    };
  }

  export const list = async () => {
    const select = await Drizzle.db
      .select()
      .from(donorsTable)
      .where(eq(donorsTable.isActive, true));
    return select.map(serialize);
  };

  export const create = fn(InfoSchema.partial({ id: true }), async (data) => {
    const id = data.id || createID("animal");
    await Drizzle.db.insert(donorsTable).values({ ...data, id });
    return id;
  });

  export const update = fn(InfoSchema, async (data) => {
    await Drizzle.db
      .update(donorsTable)
      .set({ ...data, timeUpdated: new Date() })
      .where(eq(donorsTable.id, data.id));
    return data.id;
  });

  export const getDetail = fn(InfoSchema.pick({ id: true }), async ({ id }) => {
    const select = await Drizzle.db
      .select()
      .from(donorsTable)
      .where(and(eq(donorsTable.id, id), eq(donorsTable.isActive, true)));
    return select.map(serialize).at(0);
  });

  export const deactivate = fn(
    InfoSchema.pick({ id: true }),
    async ({ id }) => {
      await Drizzle.db
        .update(donorsTable)
        .set({ isActive: false, timeDeleted: new Date() })
        .where(eq(donorsTable.id, id));
      return id;
    }
  );
}
