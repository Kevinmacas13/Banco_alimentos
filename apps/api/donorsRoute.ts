// import { zValidator } from '@hono/zod-validator'
import { Hono } from "hono";
import { Examples, Animal } from "@appanimals/core";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import { z } from "zod";
import { ErrorResponses, validator } from "./common";

export const animalRoute = new Hono();

animalRoute
  .post(
    "/",
    describeRoute({
      tags: ["Animal"],
      summary: "Crea un animal",
      description: "Crea un animal para el usuario",
      requestBody: {
        content: {
          "application/json": {
            schema: resolver(Animal.InfoSchema),
            example: Examples.Animal,
          },
        },
      },
      responses: {
        201: {
          description: "Respuesta exitosa",
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  data: z.literal("Ok"),
                })
              ),
              example: { data: "Ok" },
            },
          },
        },
        400: ErrorResponses[400],
        500: ErrorResponses[500],
      },
    }),
    validator("json", Animal.InfoSchema),
    async (c) => {
      const body = c.req.valid("json");
      await Animal.create(body);
      return c.json({ data: "Ok" }, 201);
    }
  )
  .get(
    "/",
    describeRoute({
      tags: ["Animal"],
      summary: "Lista los animals",
      description: "List todos los animals de estudio de un usuario.",
      responses: {
        200: {
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  data: Animal.InfoSchema.array().openapi({
                    description: "Lista de Animals",
                    example: [Examples.Animal],
                  }),
                })
              ),
              example: {
                data: [Examples.Animal],
              },
            },
          },
          description: "A list of animals.",
        },
        500: ErrorResponses[500],
      },
    }),
    async (c) => {
      const animals = await Animal.list();
      return c.json({ data: animals }, 200);
    }
  )
  .get(
    "/:id",
    describeRoute({
      tags: ["Animal"],
      summary: "Obtener animal por ID",
      description: "Recupera un animal específico por su ID.",
      responses: {
        200: {
          description: "Respuesta exitosa",
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  data: Animal.InfoSchema,
                })
              ),
              example: { data: Examples.Animal },
            },
          },
        },
        400: ErrorResponses[400],
        404: ErrorResponses[404],
        500: ErrorResponses[500],
      },
    }),
    validator("param", Animal.InfoSchema.pick({ id: true })),
    async (c) => {
      const id = c.req.valid("param").id;
      const animal = await Animal.getDetail({ id });

      if (!animal) {
        return c.json(
          {
            type: "not_found",
            code: "resource_not_found",
            message: "The requested resource could not be found",
          },
          404
        );
      }

      return c.json({ data: animal }, 200);
    }
  )
  .put(
    "/:id",
    describeRoute({
      tags: ["Animal"],
      summary: "Actualizar animal por ID",
      description: "Actualiza un animal existente identificado por su ID.",
      requestBody: {
        content: {
          "application/json": {
            schema: resolver(Animal.InfoSchema),
            example: Examples.Animal,
          },
        },
      },
      responses: {
        200: {
          description: "Respuesta exitosa",
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  data: Animal.InfoSchema,
                })
              ),
              example: { data: Examples.Animal },
            },
          },
        },
        400: ErrorResponses[400],
        404: ErrorResponses[404],
        500: ErrorResponses[500],
      },
    }),
    validator("json", Animal.InfoSchema),
    async (c) => {
      const id = c.req.param("id");
      const body = c.req.valid("json");
      await Animal.update({ ...body, id });
      return c.json({ data: "Ok" }, 200);
    }
  )
  .delete(
    "/:id",
    describeRoute({
      tags: ["Animal"],
      summary: "Eliminar animal por ID",
      description: "Elimina un animal por su ID.",
      responses: {
        204: {
          description: "Sin Contenido. Animal eliminado exitosamente.",
        },
        400: ErrorResponses[400],
        404: ErrorResponses[404],
        500: ErrorResponses[500],
      },
    }),
    validator("param", Animal.InfoSchema.pick({ id: true })),
    async (c) => {
      const id = c.req.param("id");
      await Animal.deactivate({ id });
      return c.body(null, 204);
    }
  );
