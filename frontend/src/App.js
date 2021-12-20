//--imports--//
//data pages
import './App.css';

//components
import Login from './pages/Login';
import Signup from './pages/SignUp'
import Navbar from './components/NavBar'
import MyCharacters from './pages/MyCharacters';
import Header from './components/Header';
import CreateCharacter from './pages/CreateCharacter';
import CharacterPage from './pages/CharacterPage'

//context
import { useContext } from 'react'
import { VisitorContext } from './context/VisitorContext'


//packages
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import { useEffect} from 'react'
import env from 'react-dotenv'

//--Function--//
function App() {


  //global states
  const {entryState, fetchErrorState, charListState, apiIndexState} = useContext(VisitorContext)
  const [entry,setEntry] = entryState
  const [,setFetchError] = fetchErrorState
  const [,setCharList] = charListState
  const [apiIndex,setApiIndex] = apiIndexState

  //Effect/Functions

  const checkLogin = async () => {
    await axios.get(`${env.BACKEND_URL}/user/${localStorage.getItem('userId')}`)
    .then((response)=>{
        console.log(response);
        console.log(`user ${localStorage.getItem('userId')} is logged in`)
        localStorage.setItem('userId',response.data.id)
        setEntry(true)
    }).catch((error) => {
        console.log(error)
        console.log('no user is logged in')
        localStorage.removeItem('userId')
        setEntry(false)
    })
}

useEffect((
  async (e) => {
    // e.preventDefault()
      if (localStorage.getItem('userId') > 0 && entry === false) {
          checkLogin()
      }
  }
),[])


  //--return--//
  return (
    <div className="App">
      {/* <div className='header-container'> */}
        <Header />
        {/* <div className='navbar-upper'></div> */}
        <Navbar />
        {/* <div className='navbar-lower'></div> */}
      {/* </div> */}
      <div className='body'>
        <Routes>
          <Route path = "/" element={<MyCharacters />} />
          <Route path = "/create-character" element={<CreateCharacter />} />
          <Route path = "/login" element={<Login />}/>
          <Route path = "/signup" element={<Signup />}/>
          <Route path = "/details" element={<CharacterPage />}/>
        </Routes>
      </div>
      <div className='footer'>
      </div>
    </div>
  );
}

export default App;
