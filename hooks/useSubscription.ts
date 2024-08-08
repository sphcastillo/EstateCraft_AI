'use client'

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

// number of docs the user is allowed to have
export const PRO_LIMIT = 20;
export const FREE_LIMIT= 2;

function useSubscription() {
    const [hasActiveMembership, setHasActiveMembership] = useState(null);
    const [isOverFileLimit, setIsOverFileLimit] = useState(false);
    const { user } = useUser();

    // listen to the User document
    const [snapshot, loading, error] = useDocument(
        user && doc(db, "users", user.id),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    // Listen to the users files collection
    const [filesSnapshot, filesLoading] = useCollection(
        user && collection(db, "users", user?.id, "files")
    );

    // Listen the active membership and toggle the state 
    useEffect(() => {
        if(!snapshot) return;

        const data = snapshot.data();
        console.log("Debug #1 ~ Subscription data: ", data);
        if(!data) return;

        console.log("Debug #2 ~ Are we active membership: ", data.hasActiveMembership);

        setHasActiveMembership(data.hasActiveMembership)

    }, [snapshot]);

    // If the user goes over the file limit, we will toggle 
    useEffect(() => {

        if(!filesSnapshot || hasActiveMembership === null) return;

        const files = filesSnapshot.docs;
        const usersLimit = hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;


        // console.log(
        //     "Checking if user is over file limit",
        //     files.length,
        //     usersLimit
        // );

        setIsOverFileLimit(files.length >= usersLimit);

    }, [filesSnapshot, hasActiveMembership, PRO_LIMIT, FREE_LIMIT]);

    return { hasActiveMembership, loading, error, isOverFileLimit, filesLoading };

}

export default useSubscription;