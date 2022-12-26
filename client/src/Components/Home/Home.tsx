import { useAppDispatch, useAppSelector } from "../../Redux/hooks"
import { useEffect, useRef, useState} from 'react'
import { ALL_CHATS, ALL_MESSAGES, ALL_USERS, CLEAR_RESPONSE, LAST_CONNECTION, USER_CHATS } from "../../Redux/actions/actions"
import { getAuth, signOut } from "firebase/auth"
import PrivateChat from "./PrivateChat/PrivateChat"
import s from './Home.module.css'
import { useNavigate } from "react-router-dom"
import Users from "./Users/Users"
import Contacts from "./Contacts/Contacts"
import Profile from "./Profile/Profile"
import { Alert, AlertIcon, AlertTitle, Input, Text } from '@chakra-ui/react'
import { RiChatNewLine } from 'react-icons/ri'
import { HiLogout } from 'react-icons/hi'
import { GrGroup } from 'react-icons/gr'
import BlockUsers from "./BlockUsers/BlockUsers"
import { TbUserOff } from 'react-icons/tb'
import { io } from "socket.io-client"
import ChatGroups from "./ChatGroups/ChatGroups"
import Chatss from "./Chats/Chats"
import { userDisconnected } from "../../types"
import { sortChats, sortMessagees } from "./Tools/Tools"
import { AiOutlineUserAdd } from "react-icons/ai"

export default function Home(){
    const dispatch = useAppDispatch()
    const auth = getAuth()
    const navigate = useNavigate()
    const socket: any = useRef()
    //DESLOGEAR
    const logOut = () => {
        socket.current.disconnect()
        signOut(auth)
        navigate('/')
    }
    // const portSocket = process.env.SOCKET_PORT || 6976 || 3002
    
    //ESTADOS DEL REDUCER
    const allUsers = useAppSelector(state => state.clientReducer.users)
    const respuesta = useAppSelector(state => state.clientReducer.response)
    const userChats = useAppSelector(state => state.clientReducer.userChats)
    const allMessages = useAppSelector(state => state.clientReducer.messages)
    const currentUser = allUsers?.filter(e => e.userEmail === auth?.currentUser?.email)[0]

    // SOCKET CONNECTION 
    useEffect(() => {
        socket.current = io('https://fastchat-production-26db.up.railway.app/')
        socket.current?.on("userDisconnected",(data:userDisconnected)=>{
            dispatch(LAST_CONNECTION(data))
        })
    }, [dispatch])

    //PARA LOS CHATS DEL USUARIO LOGEADO
    useEffect(() =>{
        dispatch(ALL_USERS())
        if(currentUser?._id){
            dispatch(ALL_MESSAGES())
            dispatch(USER_CHATS(currentUser._id))
            dispatch(ALL_CHATS())
            socket.current?.emit('addUser', currentUser?._id)
        }
    }, [dispatch, currentUser?._id])

    // SET OFF ALERT 
    if (respuesta?.ok){
        setTimeout(()=>{
            dispatch(CLEAR_RESPONSE())
        },3000)
    }
    //FILTER USER CHATS
    const [searchChat, setSearchChat] = useState('')
    const handleSearchChat = (e: React.ChangeEvent<HTMLInputElement>) =>{ 
        setSearchChat(e.target.value)
    }

    //ORDENAR LOS CHATS SEGUN LA HORA DEL ULTIMO
    const mapIdChats = userChats.map(e => e._id)
    let filterMessagesIds = allMessages.filter(e => mapIdChats.includes(e.chatId))
    const sortMessages = sortMessagees(filterMessagesIds)
    const sortChatss = sortChats(filterMessagesIds, userChats)
    const probando = userChats.filter(e => e._id !== sortMessages[0]?.chatId)
    const lastChat = [...sortChatss, ...probando]

    //PARA BUSCAR UN CHAT EN EL INPUT
    const filterUserChats = lastChat?.filter(e => e.chatsUsers[0]?.nickName.includes(searchChat) 
        || e.chatsUsers[1]?.nickName.includes(searchChat)  
        || e.chatsUsers[0]?.nickName.toLowerCase().includes(searchChat) 
        || e.chatsUsers[1]?.nickName.toLowerCase().includes(searchChat) 
        || e.chatsUsers[0]?.nickName.toUpperCase().includes(searchChat) 
        || e.chatsUsers[1]?.nickName.toUpperCase().includes(searchChat) 
        || e.groupName?.includes(searchChat) 
        || e.groupName?.toLowerCase().includes(searchChat) 
        || e.groupName?.toUpperCase().includes(searchChat) 
        )    

    //USE STATE
    const [currentChat, setCurrentChat] = useState('')
    
    //SETTEAR VALOR DEL CURRENT CHAT
    const handleChat = (chatId: string ) => {
        if(chatId) {
            setCurrentChat(chatId)
        }
    }
    //PERFIL DEL CONTACTO QUE TIENE EL CHAT ABIERTO
    let allChats = useAppSelector(state => state.clientReducer.chats)
    allChats = allChats?.filter(e => e._id === currentChat)
    const friendId = allChats[0]?.chatsUsers?.filter(e => e._id !== currentUser?._id)[0]
    
    //PARA MOSTRASR LA INTERFAZ DE CONTACTOS O LA DE USUARIOS
    const [contacts, setContacts ] = useState(true)
    const [usuarios, setUsuarios] = useState(true)
    const [profile, setProfile] = useState(true)
    const [block, setBlock] = useState(true)
    const [createGroup, setCreateGroup] = useState(true)

    const handleContacts = () => {
        setContacts(!contacts)
    }

    const handleUsuarios = () => {
        setUsuarios(!usuarios)
    }

    const handleProfile = () => {
        setProfile(!profile)
    }

    const handleBlock = () => {
        setBlock(!block)
    }

    const handleGroups = () => {
        setCreateGroup(!createGroup)
    }

    //INAKI LA PROXIMA DEPLOYAS Y HACES RESPONSIVE VOS PELOTUDO
    const [chatResponsive, setChatResponsive] = useState(false)

    const handleChatResponsive = () => {
        if(window.innerWidth <= 500){
            setChatResponsive(true)
        }
    }

    return(
    <div className={s.contenedor}>
        <div className={chatResponsive ? s.responsiveNone : s.divAside}>
            {/* DEFAULT UI  */}
            <div className={!contacts || !usuarios || !profile || !block || !createGroup ? s.none : s.asdasd}>
                <div className={s.divResponsiveBards}>
                    <img src={currentUser?.image} alt="asd" width='48px' className={s.imagenPerfil} onClick={handleProfile}/>
                </div>
                <div className={s.perfilAside}>
                    <img src={currentUser?.image} alt="asd" width='48px' className={s.imagenPerfil} onClick={handleProfile}/>
                    <div>
                        <button onClick={handleContacts}><RiChatNewLine className={s.iconos}/></button>
                        <button onClick={handleGroups}><GrGroup className={s.iconos}/></button>
                        <button onClick={handleBlock}><TbUserOff className={s.iconos}/></button>
                        <button onClick={handleUsuarios}><AiOutlineUserAdd className={s.iconos}/></button>
                        <button onClick={() => logOut()}><HiLogout className={s.iconos}/></button>
                    </div>
                </div>
                {/* ACA PARA EL RESPONSIVE  */}
                <div className={s.perfilResponsive}>
                        <button onClick={handleContacts}><RiChatNewLine className={s.iconos}/></button>
                        <button onClick={handleGroups}><GrGroup className={s.iconos}/></button>
                        <button onClick={handleBlock}><TbUserOff className={s.iconos}/></button>
                        <button onClick={handleUsuarios}><AiOutlineUserAdd className={s.iconos}/></button>
                        <button onClick={() => logOut()}><HiLogout className={s.iconos}/></button>
                </div>
                    <div className={s.inputChats}>
                        <Input variant='filled' type="text" placeholder="Search chat.." value={searchChat} onChange={handleSearchChat} />
                    </div>
                <div className={s.divChatsDefault}>
                {   
                    filterUserChats.length !== 0 
                    ? filterUserChats && filterUserChats?.map(e => {
                        return(
                            <div key={e._id} className={s.botonesChats}>
                                <button onClick={() => handleChat(e._id)} className={s.abrirChat}><PrivateChat allMessages={allMessages} currentChat={currentChat}  allChatData={e} chatUser={e.chatsUsers} currentUser={currentUser} socket={socket}/></button>
                            </div>)
                    })
                    : lastChat && lastChat?.map(e => {
                        return(
                            <div key={e._id} className={s.botonesChats}>
                                <button onClick={() => handleChat(e._id)} className={s.abrirChat}><PrivateChat allMessages={allMessages}  allChatData={e} chatUser={e.chatsUsers} currentUser={currentUser} currentChat={currentChat} socket={socket}/></button>
                            </div>
                            )
                    }) 
                }
                </div>
            </div> 
            {/* CONTACTS UI  */}
            <div className={contacts ? s.contactosHide : s.divContactos}>
                <div className={s.divProfile}>
                    <button onClick={handleContacts} className={s.botonAtras}>{'<'}</button>
                    <Text fontSize='20px'>Contacts</Text>
                </div>
                <Contacts socket={socket} currentUser={currentUser} />
            </div>
            <div className={profile ? s.contactosHide : s.div}>
                <div className={s.divProfile}> 
                    <button onClick={handleProfile} className={s.botonAtras}>{'<'}</button>
                    <Text fontSize='20px'>Profile</Text>
                </div>
                <Profile currentUser={currentUser}/>
            </div>
            {/* USUARIOS UI  */}
            <div className={usuarios ? s.contactosHide : s.div}>
                <div className={s.divProfile}>
                    <button onClick={handleUsuarios} className={s.botonAtras}>{'<'}</button>
                    <Text fontSize='20px'>Users</Text>
                </div>
                <Users currentUser={currentUser}/>
            </div>
            {/* {BLOCK USERS} */}
            <div className={block ? s.contactosHide : s.div}>
                <div className={s.divProfile}> 
                    <button onClick={handleBlock} className={s.botonAtras}>{'<'}</button>
                    <Text fontSize='20px'>Block Users</Text>
                </div>
                <BlockUsers currentUser={currentUser}/>
            </div>
            {/* CREATE GROUP */}
            <div className={createGroup ? s.contactosHide : s.div}>
                <div className={s.divProfile}> 
                    <button onClick={handleGroups} className={s.botonAtras}>{'<'}</button>
                    <Text fontSize='20px'>Create Group</Text>
                </div>
                <ChatGroups socket={socket.current} setCreateGroup={setCreateGroup} currentUser={currentUser}/>
            </div>
        {
                respuesta?.ok &&
                <div className={s.alert}>
                <Alert status="success">
                    <AlertIcon />
                    <AlertTitle>{respuesta.msg} </AlertTitle>
                </Alert>
                </div>
            }
        </div>
        <div>
            <Chatss currentChat={currentChat} setCurrentChat = {setCurrentChat} currentUser={currentUser} friendId={friendId} socket={socket} allChats={allChats}/>
        </div>
    </div>)
}
