import { Input, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { useState } from "react"
import { BLOCK_USER, USER_CONTACTS } from "../../../Redux/actions/actions"
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks"
import { User } from "../../../types"
import s from './Users.module.css'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { IoIosArrowDown } from "react-icons/io"
interface Props {
    currentUser: User
}


export default function Users({currentUser}: Props){    
    const allUsers = useAppSelector(state => state.clientReducer.users)
    const idBlockUsers = currentUser?.bloqUsers?.map(e => e._id)
    const filterUsers = allUsers.filter(e => e._id !== currentUser?._id && !idBlockUsers?.includes(e._id))
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

    //BLOQUEAR Usuario
    const [block, setBlock] = useState({
        userId: '',
        bloqUserId: ''
    })

    const handleBlockId = (e: string) => {
        if (currentUser?._id) {
            setBlock({
                userId: currentUser._id,
                bloqUserId: e
            })
        }
    }

    const bloqUser = () => {
        dispatch(BLOCK_USER(block))
        // setTimeout(() => {
        //     window.location.reload()
        // }, 2000)
    }

    return(
        <div className={s.contenedor}>
            <div className={s.formBusqueda}>
                <Input variant='filled' type="text" name="busqueda" value={busqueda} onChange={handleBusqueda} placeholder='Search user...'/>
            </div>
                {
                     searchUsers.length !== 0 
                    ? searchUsers.map(e => {
                        return(<div key={e._id} className={s.profileUsers}>
                            <img src={e.image} alt="asd" width='50px' className={s.imagenes}/>
                            <span>{e.nickName}</span>
                            {/* <button className={s.sendMensaje} onMouseEnter={() => handleDataNewContact(e._id)} onClick={handleNewContact}>
                                <AiOutlineUserAdd className={s.icono}/>
                            </button> */}
                            <div className={s.arrowDown}>
                                    <Menu>
                                        <MenuButton><IoIosArrowDown/></MenuButton>
                                        <MenuList>
                                            <MenuItem onMouseEnter={() => handleDataNewContact(e._id)} onClick={handleNewContact}>Add User</MenuItem>
                                            <MenuItem onMouseEnter={() => handleBlockId(e._id)} onClick={bloqUser}>Bloq User</MenuItem>
                                        </MenuList>
                                    </Menu>
                            </div>
                            </div>)
                    })
                    : filterUsers && filterUsers.map(e => {
                        return(<div key={e._id} className={s.profileUsers}>
                            <img src={e.image} alt="asd" width='50px' className={s.imagenes}/>
                            <span>{e.nickName}</span>
                            {/* <button className={s.sendMensaje} onMouseEnter={() => handleDataNewContact(e._id)} onClick={handleNewContact}>
                                <AiOutlineUserAdd className={s.icono}/>
                            </button> */}
                            <div className={s.arrowDown}>
                                    <Menu>
                                        <MenuButton><IoIosArrowDown/></MenuButton>
                                        <MenuList>
                                            <MenuItem onMouseEnter={() => handleDataNewContact(e._id)} onClick={handleNewContact}>Add User</MenuItem>
                                            <MenuItem onMouseEnter={() => handleBlockId(e._id)} onClick={bloqUser}>Bloq User</MenuItem>
                                        </MenuList>
                                    </Menu>
                            </div>
                            </div>)
                    })
                }
        </div>)
}