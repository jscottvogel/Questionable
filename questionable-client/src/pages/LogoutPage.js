import React from "react";
import { useNavigate } from "react-router-dom"
import { signOut } from "../auth"
import { useEffect } from "react"


export default function LogoutPage() {
    const navigate = useNavigate();

    useEffect( () => {
        signOut()

        navigate( "/" );
    }, [ navigate ] )

    return (
        <div>
            <h2>Logout</h2>
            <p>Logging out...</p>
        </div>
    )
}

