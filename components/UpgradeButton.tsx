"use client";

import React from "react";
import useSubscription from "../hooks/useSubscription";
import { Button } from "./ui/button";
import { Loader2Icon, StarIcon } from "lucide-react";
import { createStripePortal } from "../actions/createStripePortal";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";

function UpgradeButton() {
  const { hasActiveMembership, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAccount = async () => {
    startTransition(async () => {
      const stripePortalUrl = await createStripePortal();
      router.push(stripePortalUrl);
    });
  };

  if (!hasActiveMembership && !loading)
    return (
      <Button
        asChild
        variant="default"
        className="border-indigo-600 text-white"
      >
        <Link href="/dashboard/upgrade">
          upgrade <StarIcon className="text-indigo-600 text-white" />
        </Link>
      </Button>
    );

  if (loading)
    return (
      <Button variant="default" className="border-indigo-600">
        <Loader2Icon className="animate-spin" />
      </Button>
    );

  return (
    <Button
      asChild
      variant="default"
      onClick={handleAccount}
      disabled={isPending}
      className="border-indigo-600 text-white"
    >
      {isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <p>
          <span className="font-extrabold">PRO</span>
          ACCOUNT
        </p>
      )}
    </Button>
  );
}

export default UpgradeButton;
