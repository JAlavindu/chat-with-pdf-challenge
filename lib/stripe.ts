/* eslint-disable @typescript-eslint/no-unused-vars */
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(stripeSecretKey);

export default stripe;
