import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import { useContext } from "react"
import { VisitorContext } from "../context/VisitorContext"

import axios from 'axios'
import env from 'react-dotenv'

const Signup = (props) => {

    //global states
    const {entryState} = useContext(VisitorContext)
    const [entry, setEntry] = entryState

    //local state
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [,setEmailError]=useState('')
    
    const fetchSignUp = () => {
        axios.post(`${env.BACKEND_URL}/user/signup`,{email,password}).then((response)=>{
            console.log(response)
            localStorage.setItem('userId',response.data.user.id)
            setEntry(true)
        })
        .catch((error)=>{
            setEmailError(error.message)
            console.log(error)
        })
    }

    return (
        <div className='signup'> 
            {entry
            ?
            <Navigate push to="/" />
            :
            <><h1 className='label'>Signup</h1><form onSubmit={(e) => { e.preventDefault(); fetchSignUp()}}>
                    <input id="login" onChange={(e) => { setEmail(e.target.value) } } placeholder={'Email'} />
                    <input id="password" type={'password'} onChange={(e) => { setPassword(e.target.value);} } placeholder={'Password'} />
                    <button type={'submit'}>Signup</button>
                </form></>
            }
        </div>
    )
}

export default Signup