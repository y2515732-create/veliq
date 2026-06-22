import { Router } from "express";
import Stripe from "stripe";
import twilio from "twilio";
import axios from "axios";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-05-27.dahlia",
});

router.post(
  "/webhook",
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret || !sig) {
      res.status(400).send("Webhook secret not configured");
      return;
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      req.log.error({ err }, "Webhook signature verification failed");
      res.status(400).send(`Webhook Error: ${msg}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userEmail = session.customer_email ?? "";
      const userName = session.metadata?.userName ?? "";
      const userPhone = session.metadata?.userPhone ?? "";

      req.log.info({ userEmail, userName }, "New paying customer");

      await db.insert(usersTable).values({
        name: userName,
        email: userEmail,
        phone: userPhone || null,
        status: "pending",
      }).onConflictDoNothing();

      const log = req.log as { info: (obj: object, msg: string) => void; error: (obj: object, msg: string) => void };
      provisionViloNumber(log, userEmail, userName, userPhone).catch(
        (err) => req.log.error({ err, userEmail }, "Provisioning error"),
      );
    }

    res.status(200).send("OK");
  },
);

async function provisionViloNumber(
  log: { info: (obj: object, msg: string) => void; error: (obj: object, msg: string) => void },
  userEmail: string,
  userName: string,
  userPhone: string,
) {
  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );

  const available = await twilioClient.availablePhoneNumbers("US").local.list({ limit: 3 });
  if (!available.length) throw new Error("No numbers available right now");

  const numberToBuy = available[0].phoneNumber;
  const purchased = await twilioClient.incomingPhoneNumbers.create({ phoneNumber: numberToBuy });
  const viloNumber = purchased.phoneNumber;

  log.info({ viloNumber }, "Bought Twilio number");

  const elevenResponse = await axios.post(
    "https://api.elevenlabs.io/v1/convai/phone-numbers",
    {
      provider: "twilio",
      phoneNumber: viloNumber,
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      label: `Vilo-${userName}`,
    },
    {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY ?? "",
        "Content-Type": "application/json",
      },
    },
  );

  const phoneNumberId = (elevenResponse.data as { phone_number_id?: string })?.phone_number_id ?? "unknown";

  log.info({ phoneNumberId }, "Imported to ElevenLabs");

  await db
    .update(usersTable)
    .set({
      viloNumber,
      twilioSid: purchased.sid,
      elevenLabsPhoneId: phoneNumberId,
      status: "active",
    })
    .where(eq(usersTable.email, userEmail));

  if (userPhone && process.env.TWILIO_MAIN_NUMBER) {
    await twilioClient.messages.create({
      body: `Welcome to Vilo AI, ${userName}! Your personal number ${viloNumber} is now LIVE. Call it anytime.`,
      from: process.env.TWILIO_MAIN_NUMBER,
      to: userPhone,
    });
  }

  log.info({ userEmail, viloNumber }, "Vilo AI fully provisioned");
}

export default router;
