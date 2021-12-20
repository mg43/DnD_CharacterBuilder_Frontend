import { useState, createContext } from "react";

const VisitorContext = createContext()

const VisitorProvider = ({children}) => {
    const [entry,setEntry] = useState(false)
    const [fetchError,setFetchError] = useState(false)
    const [charList,setCharList] = useState([])
    const [apiIndex,setApiIndex] = useState([])
    const [stats,setStats] = useState([
        {stat: 'Constitution', score: 8},
        {stat: 'Strength', score: 8},
        {stat: 'Dexterity', score: 8},
        {stat: 'Inteligence', score: 8},
        {stat: 'Wisdom', score: 8},
        {stat: 'Charisma', score: 8}
    ])
    const [character,setCharacter] = useState([])

    const state = {

        //tracks if they are logged in
        entryState: [entry,setEntry],
        //stores character info when creating a new character
        apiIndexState: [apiIndex,setApiIndex],
        //stores users character list
        charListState: [charList,setCharList],
        //stores users character list
        fetchErrorState: [fetchError,setFetchError],
        //stores stats
        statsState: [stats,setStats],
        //stores selected character
        characterState: [character,setCharacter]

    }

    return (
        <VisitorContext.Provider value={state}>
            {children}
        </VisitorContext.Provider>
    )
}

export { VisitorContext, VisitorProvider }