import { Router } from "express";
import { desc } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";

const router = Router();

function requireAdminPassword(
  req: import("express").Request,
  res: import("express").Response,
  next: import("express").NextFunction,
) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(503).json({ error: "Admin access not configured" });
    return;
  }

  const authHeader = req.headers["authorization"] ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (token !== adminPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}

router.get("/admin/users", requireAdminPassword, async (req, res) => {
  try {
    const users = await db
      .select()
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt));

    res.json({
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone ?? null,
        viloNumber: u.viloNumber ?? null,
        twilioSid: u.twilioSid ?? null,
        elevenLabsPhoneId: u.elevenLabsPhoneId ?? null,
        stripeSessionId: u.stripeSessionId ?? null,
        status: u.status,
        createdAt: u.createdAt.toISOString(),
      })),
      total: users.length,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list admin users");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
