import { unauthenticate } from "@onflow/fcl";
import { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";

export function UnauthenticateButton() {
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        const unsubscribe = fcl.currentUser().subscribe((user: any) => {
            if (!user.loggedIn) {
                console.log("User logged out!");
                setShowButton(false)
            } else {
                console.log("User logged in:", user.addr);
                setShowButton(true)
            }
        });

        // Cleanup subscription when component unmounts
        return () => {
            unsubscribe();
        };
    }, []);

    if (showButton) {
        return <button onClick={async () => await unauthenticate()}>Log out</button>
    }

    return null;
}