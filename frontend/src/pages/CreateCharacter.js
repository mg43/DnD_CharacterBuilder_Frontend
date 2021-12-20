import { useEffect, useState } from 'react'
import axios from 'axios'
import env from 'react-dotenv'
import { Navigate } from 'react-router'

import { useContext } from "react"
import { VisitorContext } from "../context/VisitorContext"


const CreateCharacter = () => {


    //local states
    const [loaded,setLoaded] = useState(false)
    const [points,setPoints] = useState(27)
    const [clicked,setClicked] = useState(false)
    const [charName,setCharName] = useState('')
    const [charRaceInfo,setCharRaceInfo] = useState({})
    const [charClassInfo,setCharClassInfo] = useState({})
    const [raceSelected,setRaceSelected] = useState(false)
    const [classSelected,setClassSelected] = useState(false)
    const [proficiencies,setProficiencies] = useState([
        {stat: 'CON', score: 0},
        {stat: 'STR', score: 0},
        {stat: 'DEX', score: 0},
        {stat: 'INT', score: 0},
        {stat: 'WIS', score: 0},
        {stat: 'CHA', score: 0}
    ])
    const [shownStats,setShownStats] = useState([
        {stat: 'Constitution', score: 8},
        {stat: 'Strength', score: 8},
        {stat: 'Dexterity', score: 8},
        {stat: 'Inteligence', score: 8},
        {stat: 'Wisdom', score: 8},
        {stat: 'Charisma', score: 8}
    ])
    const [image,setImage] = useState('')
    

    //global states
    const {entryState, fetchErrorState, apiIndexState, statsState} = useContext(VisitorContext)
    const [entry,] = entryState
    const [apiIndex,setApiIndex] = apiIndexState
    const [stats, setStats] = statsState
    const [fetchError,setFetchError] = fetchErrorState

    //other variables


    //retrieves the indexes of the items specified in the apiLoopKey
    const apiLoopKey = ['races','classes',]
    let resFinal = []

    useEffect((async () => {
        console.log('hitting effect')
            for (let i in apiLoopKey) {
                await axios.get(`https://www.dnd5eapi.co/api/${apiLoopKey[i]}/`).then((response)=>{
                    console.log(response)
                    resFinal.push(response.data.results)
                }).catch((error)=>{
                    console.log(error)
                })
            }
        setApiIndex(resFinal)
        setLoaded(true)
    }),[])


    const apiCharFetch = async (e,i) => {
        await axios.get(`https://www.dnd5eapi.co/api/${e}/${i}`).then((response)=>{
            if (e === 'races') {
                setCharRaceInfo([response.data])
                let resetStats = stats
                let resetProficiencies = proficiencies
                for (let i in stats) {
                    resetStats[i].score = 8
                    resetProficiencies[i].score = 0
                }
                setStats(resetStats)
                setProficiencies(resetProficiencies)
                setShownStats(resetStats)
                setPoints(27)
                let proficienciesCopy = proficiencies
                for (let i in response.data.ability_bonuses) {
                    for (let y in proficiencies) {
                        if (response.data.ability_bonuses[i].ability_score.name === proficiencies[y].stat) {
                            proficienciesCopy[y].score = response.data.ability_bonuses[i].bonus
                        }
                    }
                }
                setRaceSelected(true)
                setProficiencies(proficienciesCopy)
                let shownStatsCopy = shownStats
                for (let i in shownStats){
                    shownStatsCopy[i].score = stats[i].score + proficiencies[i].score
                }
                setShownStats(shownStatsCopy)
            } else {
                setCharClassInfo([response.data])
                setClassSelected(true)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }

    const statChange = async (e,i) => {
        if (points > 0 || e === -1) {
            if (stats[i].score === 18 && e === 1) {
                alert('Cannot increase a stat beyond 18')
            } else if (stats[i].score === 8 && e === -1) {
                alert('Cannot decrease a stat below 8')
            } else {
                setPoints(points - e)
                let statsCopy = stats
                let shownStatsCopy = shownStats
                statsCopy[i].score = statsCopy[i].score + e
                shownStatsCopy[i].score = shownStatsCopy[i].score + e
                setStats(statsCopy)
                setShownStats(shownStatsCopy)
            }
        } else {
            alert('No points remaining')
        } 
    }

    const saveCharacter = async () => {
        if (charName === '') {
            alert('Name cannot be blank!')
        } else {
            await axios.post(`${env.BACKEND_URL}/character/new`,{
                userId: localStorage.getItem('userId'),
                name: charName,
                race: charRaceInfo[0].name,
                speed: charRaceInfo[0].speed,
                size: charRaceInfo[0].size,
                class: charClassInfo[0].name,
                con: shownStats[0].score,
                str: shownStats[1].score,
                dex: shownStats[2].score,
                int: shownStats[3].score,
                wis: shownStats[4].score,
                cha: shownStats[5].score,
                image: image
            }).then((response)=>{
                console.log(response)
                setClicked(true)
            }).catch((error) => {
                alert('There was an error saving your character.')
                console.log(error)
            })
        }

    }

    return (
        <div className='CreateCharacter'>
                    {entry
                    ?   
                        <>
                        {loaded
                        ?
                        <>
                        {clicked
                        ?
                        <Navigate push to='/'/>
                        :
                        <>
                        <h2 className='label'>Create Your Character!</h2>
                        <form>
                            <div className='name-container'>
                                <label htmlFor='name-new' className='label-name-new'>Character Name: </label>
                                <input className='name-new' placeholder='What is your characters name?' onChange={(e) => {
                                    setCharName(e.target.value)
                                }}/>
                            </div>

                            <div className='race-container'>
                                <label htmlFor='races' className='label-race-new'>What is their race: </label>
                                <select name='races' className="race-new" onChange={async (e) => {
                                    apiCharFetch(e.target.name, e.target.value)
                                }}>
                                <option value="" disabled selected >Select a Race...</option>
                                    {apiIndex[0].map((item,i)=>{
                                        return (
                                            <option key={i} value={item.index}>{item.name}</option>
                                        )
                                    })}
                                </select>
                                {raceSelected
                                ?
                                <div className='race-info'>
                                {charRaceInfo.map((item, i) => {
                                    return(
                                        <>
                                        <div className='race-speed'>Speed: {item.speed}ft</div>
                                        <div>Size: {item.size}</div>
                                        <div className='race-Alignment'><div>-Alignment-</div>{item.alignment}</div>
                                        <div><div>-Age-</div> {item.age}</div>
                                        <div className='ability-bonuses-race'>
                                            <label htmlFor='ability-bonuses' className='ability-bonus-label'>-Racial ability score bonuses-</label>
                                            {charRaceInfo[0].ability_bonuses.map((item, i) => {
                                                return(
                                                    <div name='ability-bonuses'>{item.ability_score.name}: +{item.bonus}</div>
                                                )
                                                })}
                                        </div>
                                        </>
                                    )
                                })}
                                    
                                </div>
                                :null
                                }

                            </div>
                        
                           
                            <div className='class-container'>
                                <label htmlFor='classes' className='label-race-new'>What is their class: </label>
                                <select name='classes' className="class-new" onChange={async (e) => {
                                    apiCharFetch(e.target.name, e.target.value)
                                }}>
                                <option value="" disabled selected >Select a Class...</option>
                                    {apiIndex[1].map((item,i)=>{
                                        return (
                                            <option key={i} value={item.index}>{item.name}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            {classSelected
                            ?
                            <>
                            <div className='class-info'>
                                
                                {charClassInfo.map((item, i) => {
                                    return(
                                        <div>
                                            Hit Die: {item.hit_die}
                                        </div>
                                    )
                                })}
                                <div>-Proficiencies-</div>
                                {charClassInfo[0].proficiencies.map((item,i)=>{
                                    return(
                                        <div>
                                            {item.name}
                                        </div>
                                    )
                                })}
                                <div>Saving Throws:</div>
                                {charClassInfo[0].saving_throws.map((item,i)=>{
                                    return(
                                        <div>
                                            {item.name}
                                        </div>
                                    )
                                })}
                            </div>

                            <div className='ability-scores-new'>
                                <div className='ability-label'>-Ability Scores-</div>
                                <div className='ability-points'>Points remaining: {points}</div>
                                <div className='ability-scores-container'>
                                {shownStats.map((item,i) =>{
                                    return (
                                        <div key={i} className={item.stat + '-container'}>
                                            <label htmlFor={item.stat + '-tally'}>{item.stat}</label>
                                            <div name={item.stat + '-tally'}>
                                                <button value={i} onClick={(e) => {e.preventDefault(),statChange(1,e.target.value)}}>+</button>
                                                <span>{item.score}</span>
                                                <button value={i} onClick={(e) => {e.preventDefault(),statChange(-1,e.target.value)}}>-</button>
                                            </div>
                                        </div>
                                    )
                                })
                                }
                                </div>
                                
                            </div>
                            </> 
                            :null
                            }
                            <div>
                                <label htmlFor='url'>Add character image: </label>
                                <input name='url' placeholder='url for character image' onChange={(e) => {
                                    setImage(e.target.value)
                                }}/>
                            </div>
                            {points === 0
                                ? <button className='create-character' onClick={(e) => {
                                    e.preventDefault();
                                    saveCharacter()
                                }}>Create Character</button>
                                : null
                            }
                        </form>
                        </>
                        }
                        </>
                        :
                        <h1>Loading...</h1>
                        }
                        </>
                        
                    :
                        <Navigate push to='/login'/>
                    }
        </div>
    )
}
export default CreateCharacter