"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { doc, collection } from "firebase/firestore";
import { db } from "@/firebase";

const PRO_LIMIT = 2;
const FREE_LIMIT = 2;

function useSubscription() {
  const [hasActiveMembership, setHasActiveMembership] = useState(false);
  const [isOverFileLimit, setIsOverFileLimit] = useState(false);
  const { user } = useUser();

  //listen to the user doc
  const [snapshot, loading, error] = useDocument(
    user && doc(db, "users", user.id),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  //listen to  the users file collection
  const [filesSnapshot, filesLoading] = useCollection(
    user && collection(db, "users", user.id, "files"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    if (!snapshot) return;

    const data = snapshot.data();
    if (!data) return;

    setHasActiveMembership(data.subscriptionStatus === "active");
  }, [snapshot]);

  useEffect(() => {
    if (!filesSnapshot || hasActiveMembership == null) return;

    const files = filesSnapshot.docs;
    const usersLimit = hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;

    console.log(
      "checking if user is over file limit",
      files.length,
      usersLimit
    );

    setIsOverFileLimit(filesSnapshot.docs.length >= FREE_LIMIT);
  }, [filesSnapshot, hasActiveMembership, PRO_LIMIT, FREE_LIMIT]);

  return {
    hasActiveMembership,
    loading,
    error,
    isOverFileLimit,
    filesLoading,
  };
}

export default useSubscription;
