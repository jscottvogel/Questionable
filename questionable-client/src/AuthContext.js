import { createContext, useState, useEffect } from "react"
import * as auth from "./auth"

const AuthContext = createContext()

function AuthProvider( { children } ) {
    const [ user, setUser ] = useState( null );
    const [ session, setSession ] = useState( null );
    const [ isLoading, setIsLoading ] = useState( true );

    const getCurrentUser = () => {
        auth.getCurrentUser().then( ( user ) => {
            setUser( user );
            setIsLoading( false );

            auth.getSession().then( ( session ) => {
                setSession( session );
            } ).catch( ( err ) => {
                setUser( null );
                setIsLoading( false );
            } );
        } ).catch( ( err ) => {
            setUser( null );
            setIsLoading( false );
        }
        );
    }

    useEffect( () => {
        getCurrentUser();
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