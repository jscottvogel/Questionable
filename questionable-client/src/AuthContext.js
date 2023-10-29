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
                //console.log( err );
                setUser( null );
                setIsLoading( false );
            } );
        } ).catch( ( err ) => {
            //console.log( err );
            setUser( null );
            setIsLoading( false );
        }
        );
    }

    useEffect( () => {
        getCurrentUser();
    }, [] )

    const signIn = ( username, password ) => {
        auth.signIn( username, password ).then( ( user ) => {
            setUser( user );
            setIsLoading( false );

            auth.getSession().then( ( session ) => {
                setSession( session );
            } ).catch( ( err ) => {
                //console.log( err );
                setUser( null );
                setIsLoading( false );
            } );
        } ).catch( ( err ) => {
            //console.log( err );
            setUser( null );
            setIsLoading( false );
        } );
    }

    const signOut = () => {
        auth.signOut().then( () => {
            setUser( null );
            setSession( null );
            setIsLoading( false );
        } ).catch( ( err ) => {
            //console.log( err );
            setUser( null );
            setSession( null );
            setIsLoading( false );
        } );
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