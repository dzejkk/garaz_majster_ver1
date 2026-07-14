import { db } from "../db/index.js";
import { vehicles, users } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";

export const vehicleModel = {
  // Nájsť alebo vytvoriť mock usera
  getOrCreateMockUser: async (email: string) => {
    const userEmail = email || "test@garazmajster.sk";

    let user = await db.query.users.findFirst({
      where: eq(users.email, userEmail),
    });

    if (!user) {
      const [newUser] = await db
        .insert(users)
        .values({
          clerkId: "mock_clerk_id_" + Date.now(),
          email: email,
        })
        .returning();
      user = newUser;
    }
    return user;
  },

  // Vytvoriť nové auto
  create: async (data: any) => {
    const [newVehicle] = await db.insert(vehicles).values(data).returning();
    return newVehicle;
  },

  // Vytiahnuť všetky autá + zorad podla aktualizacie od najnovsej po najstarsiu
  findAll: async () => {
    return await db.select().from(vehicles).orderBy(desc(vehicles.updatedAt));
  },

  // Aktualizovať tachometer
  update: async (id: string, data: any) => {
    const [updatedVehicle] = await db
      .update(vehicles)
      .set(data)
      .where(eq(vehicles.id, id as any))
      .returning();
    return updatedVehicle;
  },

  delete: async (id: string) => {
    const [deletedVehicle] = await db
      .delete(vehicles)
      .where(eq(vehicles.id, id))
      .returning();

    return deletedVehicle || null;
  },
};
