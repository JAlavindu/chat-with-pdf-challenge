/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import React, { startTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";
import { useTransition } from "react";
import getStripe from "@/lib/stripe-js";
import { create } from "domain";
import { createCheckoutSession } from "@/actions/createCheckoutSession";

export type UserDetails = {
  email: string;
  name: string;
};

function PricingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isPending, setIsPending] = useTransition();

  //pull in the user's subscription
  const { hasActiveMembership, loading } = useSubscription();

  const handleUpgrade = () => {
    if (!user) return;

    const userDetails: UserDetails = {
      email: user.primaryEmailAddress
        ? user.primaryEmailAddress.toString()
        : "",
      name: user.fullName!,
    };

    startTransition(async () => {
      const stripe = await getStripe();

      if (hasActiveMembership) {
        //create stripe portal
      }

      const sessionId = await createCheckoutSession(userDetails);

      await stripe?.redirectToCheckout({
        sessionId,
      });
    });
  };

  return (
    <div>
      <div className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-light text-grey-900 sm:text-5xl">
            Supercharge your Document Companion
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl px-10 text-center text-lg-leading-8 text-gray-600">
          Choose an affordable plan that suits your needs. All plans come with a
          30-day money-back guarantee.
        </p>

        <div className="max-w-md mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 md:max-w-2xl gap-8 lg:max0w-4xl">
          {/*FREE */}
          <div className="ring-1 ring-gray-200 p-8 h-fit pb-12 rounded-3xl">
            <h3 className="text-lg font-semibold leading=8 text-gray-900">
              starter plan
            </h3>
            <p className="mt-4 text-ms leading-6 text-gray-600">
              Explore Caore features at No Cost
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-light text-gray-900">
                Free
              </span>
            </p>

            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
            >
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Up to 3 messages per document
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Try out the AI chat functionality
              </li>
            </ul>
          </div>

          {/*PRO */}
          <div className="ring-2 ring-indigo-600 p-8 h-fit pb-12 rounded-3xl">
            <h3 className="text-lg font-semibold leading=8 text-gray-900">
              Pro plan
            </h3>
            <p className="mt-4 text-ms leading-6 text-gray-600">
              Maximize your productivity with unlimited documents
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-light text-gray-900">
                $5.99
              </span>
              <span className="text-sm font-semibold leading-6 text-gray-600">
                /month
              </span>
            </p>

            <Button
              className="bg-indigo-600 w-full text-white shadow-sm hover:bg-indigo-500 mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
              disabled={loading || isPending}
              onClick={handleUpgrade}
            >
              {isPending || loading
                ? "loadinng..."
                : hasActiveMembership
                ? "manage plan"
                : "upgrade to pro"}
            </Button>
            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
            >
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Store upto 20 Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Up to 100 messages per document
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Full power AI chat functionality with memory recall
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                Advanced analytics
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-indigo-600" />
                24-hour support response time
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
