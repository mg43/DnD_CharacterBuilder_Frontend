import { useEffect, useState } from 'react'
import axios from 'axios'
import env from 'react-dotenv'
import { Navigate } from 'react-router'

import { useContext } from "react"
import { VisitorContext } from "../context/VisitorContext"


const MyCharacters = () => {
    //local states
    const [loaded,setLoaded] = useState(false)
    const [clicked,setClicked] = useState(false)

    //global states
    const {entryState, fetchErrorState, charListState, characterState} = useContext(VisitorContext)
    const [entry,] = entryState
    const [fetchError,] = fetchErrorState
    const [charList,setCharList] = charListState
    const [,setCharacter] = characterState

    useEffect((async () => {
        if (entry) {
            await axios.get(`${env.BACKEND_URL}/character/fetch/${localStorage.getItem('userId')}`).then((response)=>{
                console.log(response.data)
                setCharList(response.data)
                setLoaded(true)
            }).catch((error)=>{
                console.log(error)
                // setFetchError(true)
            })
        }
      }),[entry])

      const getCharacter = async (e) => {
        await axios.get(`${env.BACKEND_URL}/character/${e}`).then((response)=>{
            console.log(response.data)
            setCharacter([response.data])
            setClicked(true)
        }).catch((error)=>{
            console.log(error)
            // setFetchError(true)
        })
    }

    return (
        <div className='MyCharacters'>
                    {entry
                    ?
                    <>
                        {clicked
                            ?
                            <Navigate push to='/details' />
                            :
                            <>
                            {fetchError
                            ?
                            <h2>!!There was an error while retrieving you character list!!</h2>
                            :
                            <>
                                {loaded
                                    ?
                                    <>
                                    {charList.length === 0
                                        ?
                                        <h1 className='label'>Start your journey by making a chracter!</h1>
                                        :
                                        <>
                                        <h2 className='label'>Character List</h2>
                                        <div className='list'>
                                        {charList.map((item, i) => {
                                            return(
                                                <div key={i} className='list-item' id={item.id} onClick={(e) => {getCharacter(e.target.id)}}>
                                                    <img className='list-image' id={item.id} onClick={(e) => {getCharacter(e.target.id)}} src={item.image} alt='!!no image found!!'/>
                                                    <span className='list-name' id={item.id} onClick={(e) => {getCharacter(e.target.id)}}>{item.name}</span>
                                                    <span className='list-class' id={item.id} onClick={(e) => {getCharacter(e.target.id)}}>{item.race}</span>
                                                    <span className='list-class' id={item.id} onClick={(e) => {getCharacter(e.target.id)}}>{item.class}</span>
        
                                                </div>
                                            )
                                        })
                                        }
                                        </div>
                                        </>
                                    }
                                    </>                  
                                   
                                    :
                                    <h1>Page Loading</h1>
                                }
                            </>
                            }
    
                            
                            </>

                        }
                        </>
                       
                    :
                        <Navigate push to='/login'/>
                    }
        </div>
    )
}
export default MyCharacters