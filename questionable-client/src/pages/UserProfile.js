import { useContext } from "react"
import { AuthContext } from "../AuthContext"
import { Breadcrumb } from "react-bootstrap"

export default function UserProfile() {
    const { user, signOut } = useContext( AuthContext )

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item href="/admin">Admin Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>User Profile</Breadcrumb.Item>
            </Breadcrumb>
            { user && (
                <div>
                    <h2>User Profile</h2>
                    <p>Username: { user.username }</p>
                    <p>Email: { user.email }</p>
                    {/* Display any other user data here */ }
                </div>
            ) }
            <button onClick={ signOut }>Sign Out</button>
        </div>
    )
}