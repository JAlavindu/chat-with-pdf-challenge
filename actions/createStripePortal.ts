"use server";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/firebaseAdmin";
import stripe from "@/lib/stripe";
import getBaseUrl from "@/lib/getBaseUrl";

export async function createStripePortal() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  //get customer ID from firebase
  const user = await adminDb.collection("users").doc(userId).get();
  const stripeCustomerId = user.data()?.stripeCustomerId;

  if (!stripeCustomerId) {
    throw new Error("User does not have a stripe customer ID");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${getBaseUrl()}/dashboard`,
  });

  return session.url;
}
