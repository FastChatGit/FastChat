import s from './App.module.css';
import Home from './Components/Home/Home';
import { Routes, Route } from 'react-router-dom'
import AuthRoute from './Firebase/useContext';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './Firebase/Secret';
import Register from './Components/Register/register';
import Login from './Components/Login/Login';
import { ChakraProvider } from '@chakra-ui/react'
import Verification from './Components/Verification/Verification';
import Redirrect from './Components/Login/Redirrect';

initializeApp(firebaseConfig)


function App() {
  return (
    <div>
    <div className={s.fondoChat}>
    <ChakraProvider>
        <Routes>
          <Route path='/verification' element={<Verification/>}/>
          <Route path='/home' element={<AuthRoute><Home/></AuthRoute>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/' element={<Redirrect><Login/></Redirrect>}/>      
        </Routes>
    </ChakraProvider>
    </div>
    <div className={s.contenedor}></div>
    </div>
  );
}

export default App;
