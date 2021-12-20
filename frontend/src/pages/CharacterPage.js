import { useEffect, useState } from 'react'
import axios from 'axios'
import env from 'react-dotenv'
import { Navigate } from 'react-router'

import { useContext } from "react"
import { VisitorContext } from "../context/VisitorContext"
import { useLinkClickHandler } from 'react-router-dom'


const CharacterPage = () => {
    //local states
    const [loaded,setLoaded] = useState(false)
    const [clicked,setClicked] = useState(true)
    const [classInfo,setClassInfo] = useState([])
    const [raceInfo,setRaceInfo] = useState([])
    const [grey,setGrey] = useState(['not-grey','grey'])

    //global states
    const {entryState, fetchErrorState, charListState, characterState} = useContext(VisitorContext)
    const [entry,] = entryState
    const [fetchError,] = fetchErrorState
    const [charList,setCharList] = charListState
    const [character,setCharacter] = characterState

    useEffect((async () => {
        await axios.get(`https://www.dnd5eapi.co/api/classes/${character[0].class.toLowerCase()}`).then((response)=>{
            console.log(response)
            setClassInfo([response.data])
        }).catch((error)=>{
            console.log(error)
        })
        await axios.get(`https://www.dnd5eapi.co/api/races/${character[0].race.toLowerCase()}`).then((response)=>{
            console.log(response)
            setRaceInfo([response.data])
        }).catch((error)=>{
            console.log(error)
        })
    }),[])

    const deleteCharacter = async () => {
        await axios.delete(`${env.BACKEND_URL}/character/${character[0].id}`).then((response)=>{
            console.log(response)
            setCharacter([])
        }).catch((error)=>{
            console.log(error)
            alert(`${character[0].name} rolled a nat 20 on their death save, and lives to fight another day!(Something went wrong while trying to delete the character)`)
        })
    }

    
    return (
        <div className='character-page'>
                    {entry
                    ?
                    <>
                    {character.length === 1
                        ?
                        <>
                        <div className='delete-button-container'>
                            <button className='delete-button' onClick={() => {deleteCharacter()}}>Delete Character</button>
                        </div>
                        <div className='character-name-container'>
                            {character.map((item,i) => {
                                return (
                                    <div className='character-name'>
                                    <span key={i}>{item.name} | {item.race} {item.class}</span></div>
                                )
                            })
                        }
                        </div>
                        <div className='character-portrait-container'>
                            {character.map((item,i) => {
                                return (
                                    <img key={i}
                                    className='character-portrait' src={item.image} alt='!!no image found!!'/>
                                )
                            })
                            }
                        </div>

                        <div className='character-attributes-container'>
                                {character.map((item,i) => {
                            return (
                                <>
                                <h3>CON: {item.con}</h3>
                                <h3>STR: {item.str}</h3>
                                <h3>DEX: {item.dex}</h3>
                                <h3>INT: {item.int}</h3>
                                <h3>WIS: {item.wis}</h3>
                                <h3>CHA: {item.cha}</h3>
                                </>
                            )
                        })
                        }
                        </div>



                        <div className='character-info-container'>

                        <div id='class-tab' className={grey[0]} onClick={() => {setClicked(true); setGrey(['not-grey','grey'])}}>Class</div>
                        <div id='race-tab' className={grey[1]} onClick={() => {setClicked(false); setGrey(['grey','not-grey'])}}>Race</div>

                        {clicked

                        ?
                        <div className='character-class-container'>
                            {classInfo.map((item,i) => {
                                return (
                                    <>
                                    <h2>{item.name}</h2>
                                    <h3>Hit-Die: {item.hit_die}</h3>
                                    <h3>-Proficiencies-</h3>
                                    <div className='character-proficiencies-list'>
                                        {classInfo[0].proficiencies.map((item,i) => {
                                            return (
                                            <>
                                            <div>{item.name}</div>
                                            </>
                                        )
                                        })}
                                    </div>
                                    </>
                                )
                            })}
                        </div>

                        : 
                        <div className='character-race-container'>
                            {raceInfo.map((item,i) => {
                                return (
                                    <>
                                    <h2>{item.name}</h2>
                                    <h3>Speed: {item.speed}</h3>
                                    <h3>Size: {item.size}</h3>
                                    <h3>-Alignment-</h3>
                                    <p>{item.alignment}</p>
                                    </>
                                )
                            })}
                        </div>

                        }
                        </div>



                        <div className='character-notes-container'>
                            <h3 htmlFor='character-notes'>- Session Notes -</h3>
                            <textarea className='character-notes' name='character-notes'/>
                        </div>
                        
                        </>
                        : <Navigate push to='/'/>
                        
                    }
                    </>    
                    :
                        <Navigate push to='/login'/>
                    }
        </div>
    )
}
export default CharacterPage