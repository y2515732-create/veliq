import { Router } from "express";
import Stripe from "stripe";
import { CreateCheckoutBody } from "@workspace/api-zod";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-05-27.dahlia",
});

router.post("/checkout", async (req, res) => {
  const parsed = CreateCheckoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "userName and userEmail are required" });
    return;
  }

  const { userName, userEmail, userPhone } = parsed.data;

  try {
    const origin =
      process.env.REPLIT_DOMAINS
        ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
        : req.headers.origin ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Vilo AI - Personal Voice Agent" },
            unit_amount: 499,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?email=${encodeURIComponent(userEmail)}`,
      cancel_url: `${origin}/cancel`,
      customer_email: userEmail,
      metadata: {
        userName,
        userPhone: userPhone ?? "",
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    req.log.error({ err }, "Failed to create checkout session");
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

export default router;
