import React from "react";
import { useState } from "react"
import { AuthContext } from "../AuthContext"
import { useContext } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"


export default function LoginPage() {
    const [ username, setUsername ] = useState( "" )
    const [ password, setPassword ] = useState( "" )
    const [ error, setError ] = useState( "" )
    const navigate = useNavigate();


    const { user, signIn } = useContext( AuthContext )


    const handleSubmit = ( e ) => {
        e.preventDefault()
        setError( "" )

        try {
            signIn( username, password )
            // Redirect to the app's main page or dashboard

            // If the user is logged in, don't show the login form
            if ( user ) {
                // Redirect to the admin dashboard page
                return navigate( "/admin" );
            }

        } catch ( err ) {
            setError( err.message )
        }

    }

    return (
        <div>
            <h2>Admin Login</h2>
            <form onSubmit={ handleSubmit }>
                <input
                    type="text"
                    placeholder="Username"
                    value={ username }
                    onChange={ ( e ) => setUsername( e.target.value ) }
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={ password }
                    onChange={ ( e ) => setPassword( e.target.value ) }
                />
                <button type="submit">Login</button>
            </form>
            { error && <p>{ error }</p> }

            <Link to="/signUp">Create Account</Link>
            <br />
            <Link to="/forgot-password">Forgot Password</Link>

        </div>
    )
}

