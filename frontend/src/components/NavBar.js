import {Link} from 'react-router-dom'
import { useContext } from "react"
import { VisitorContext } from "../context/VisitorContext"

const Navbar = () => {

    //global states
    const {entryState,} = useContext(VisitorContext)
    const [entry, setEntry] = entryState

    return (

        
        <nav className='nav-bar'>
 
            {entry
            ?
            //if logged in
            <>
                <div className='my-characters-link'><Link to="/" onClick={() => {}}>My Characters</Link></div>
                <div className='create-character-link'><Link to="/create-character" onClick={() => {}}>Create Character</Link></div>
                <div className='logout-link'><Link to='/' onClick={() => {localStorage.removeItem('userId'); setEntry(false) }}>Logout</Link></div>
            </>
            :
            //if logged out
            <>
                <div className='login-link'> <Link to="/login">Login</Link></div>
                <div className='signup-link'><Link to="/signup">Sign Up</Link></div>
            </>
            }
        </nav>
    )
}

export default Navbar