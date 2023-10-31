import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../AuthContext"

function AdminRouteGuard( { children } ) {
    const { user, session, isLoading } = useContext( AuthContext )

    if ( isLoading ) {
        return <></>
    }

    if ( !user ) {
        return <Navigate to="/login" />
    } else {
        // check the session to see if user is in admin group

        if ( user ) {
            if ( session ) {
                //console.log( session );
                //console.log( session.idToken );
                //console.log( session.idToken.payload );
                //console.log( session.idToken.payload[ 'cognito:groups' ] );
                let groups = session.idToken.payload[ 'cognito:groups' ];
                //console.log( groups );
                if ( groups === null || groups === undefined || groups.length === undefined || groups.length === 0 || !groups.includes( "Administrators" ) ) {
                    return <Navigate to="/" />
                }
            }
        }
    }

    return children
}

export default AdminRouteGuard