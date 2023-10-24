import { createContext, useState, useEffect } from "react"
import * as auth from "./auth"

const AuthContext = createContext()

function AuthProvider( { children } ) {
    const [ user, setUser ] = useState( null );
    const [ session, setSession ] = useState( null );
    const [ isLoading, setIsLoading ] = useState( true );

    const getCurrentUser = async () => {
        try {
            const user = await auth.getCurrentUser();
            setUser( user );
            const session = await auth.getSession();
            setSession( session );
        } catch ( err ) {
            // not logged in
            console.log( err );
            setUser( null );
            setSession( null );
        }
    }

    useEffect( () => {
        getCurrentUser()
            .then( () => setIsLoading( false ) )
            .catch( () => setIsLoading( false ) )
    }, [] )

    const signIn = async ( username, password ) => {
        await auth.signIn( username, password )
        await getCurrentUser();
    }
    const signOut = async () => {
        await auth.signOut();
        setUser( null );
        setSession( null );
    }

    const authValue = {
        user,
        isLoading,
        session,
        signIn,
        signOut,
    }

    return (
        <AuthContext.Provider value={ authValue }>{ children }</AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext }