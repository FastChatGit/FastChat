import { useState } from "react"
import { USER_CONTACTS } from "../../../Redux/actions/actions"
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks"
import { User } from "../../../types"
import s from './Users.module.css'

interface Props {
    currentUser: User
}


export default function Users({currentUser}: Props){    
    const allUsers = useAppSelector(state => state.clientReducer.users)
    const filterUsers = allUsers.filter(e => e._id !== currentUser?._id)

    const dispatch = useAppDispatch()

    //BUSQUEDA DE CONTACTOS
    const [busqueda, setBusqueda] = useState('')
    const searchUsers = filterUsers.filter(e => e.nickName === busqueda 
        || e.nickName.toLowerCase() === busqueda 
        || e.nickName.toUpperCase() === busqueda)

    const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value)
    }

    //ADD CONTACT
    const [addContact, setAddContact] = useState({
        userId: '',
        contact: ''
    })

    const handleDataNewContact = (e: string) => {
        if(currentUser._id !== undefined){
            setAddContact({
                userId: currentUser._id,
                contact: e
            })
        }
    }

    const handleNewContact = () => {
        dispatch(USER_CONTACTS(addContact))
    }

    return(
        <div className={s.contenedor}>
            <form className={s.formBusqueda}>
                <input type="text" name="busqueda" value={busqueda} onChange={handleBusqueda} placeholder='Search user...'/>
            </form>
                {
                     searchUsers.length !== 0 
                    ? searchUsers.map(e => {
                        return(<div key={e._id}>
                            <img src={e.image} alt="asd" width='50px' className={s.imagenes}/>
                            <span>{e.nickName}</span>
                            <button className={s.sendMensaje} onMouseEnter={() => handleDataNewContact(e._id)} onClick={handleNewContact}>Add Contact</button>
                            </div>)
                    })
                    : filterUsers && filterUsers.map(e => {
                        return(<div key={e._id}>
                            <img src={e.image} alt="asd" width='50px' className={s.imagenes}/>
                            <span>{e.nickName}</span>
                            <button className={s.sendMensaje} onMouseEnter={() => handleDataNewContact(e._id)} onClick={handleNewContact}>
                                Add Contact
                            </button>
                            </div>)
                    })
                }
        </div>)
}