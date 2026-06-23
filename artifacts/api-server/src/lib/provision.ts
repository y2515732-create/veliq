import twilio from "twilio";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export type ProvisionLog = {
  info: (obj: object, msg: string) => void;
  error: (obj: object, msg: string) => void;
};

export async function provisionViloNumber(
  log: ProvisionLog,
  userEmail: string,
  userName: string,
  userPhone: string,
) {
  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );

  // 1. Mark user as active in DB
  await db
    .update(usersTable)
    .set({ status: "active" })
    .where(eq(usersTable.email, userEmail));

  log.info({ userEmail }, "User marked active");

  // 2. Make outbound call to user via Twilio
  if (userPhone && process.env.TWILIO_MAIN_NUMBER) {
    const call = await twilioClient.calls.create({
      to: userPhone,
      from: process.env.TWILIO_MAIN_NUMBER,
      url: `${process.env.VILO_AGENT_URL}/incoming-call`,
    });
    log.info({ callSid: call.sid, userPhone }, "Outbound call initiated");
  } else {
    log.error({}, "No phone number or Twilio number configured");
  }

  log.info({ userEmail }, "Vilo outbound call completed");
}
