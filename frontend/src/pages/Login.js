import { useState } from 'react'
import axios from 'axios'
import env from 'react-dotenv'
import { Navigate } from 'react-router'

import { useContext } from "react"
import { VisitorContext } from "../context/VisitorContext"


const Login = () => {
    //global states
    const {entryState} = useContext(VisitorContext)
    const [entry,setEntry] = entryState


    //local state
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    

    const fetchLogin = (e) => {
        e.preventDefault()
        axios.post(`${env.BACKEND_URL}/user/login`,{email,password})
        .then((response)=>{
            // console.log(response);
            localStorage.setItem('userId',response.data.user.id)
            // setUser(response.data.user)
            setEntry(true)

        }).catch((error) => {
            console.log(error)
            alert('Invalid username/password')
        })
    }

    return (

            <div className='login'>
                {entry
                ?
                <Navigate push to="/" />
                :
                <><h1 className='label'>Login</h1><form onSubmit={(e) => { e.preventDefault(); fetchLogin(e)} }>
                        <input id="login" onChange={(e) => { setEmail(e.target.value) } } placeholder={'Email'} />
                        <input id="password" type={'password'} onChange={(e) => { setPassword(e.target.value) } } placeholder={'Password'} />
                        <button type={'submit'}>Login</button>
                    </form></>
                }
            </div>
    )
}
export default Login