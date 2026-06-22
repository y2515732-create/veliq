import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";

const router = Router();

router.get("/users/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, decodeURIComponent(email)))
      .limit(1);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? null,
      viloNumber: user.viloNumber ?? null,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get user");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
