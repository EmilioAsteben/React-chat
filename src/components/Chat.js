import { useState, useEffect, useRef } from 'react';
import {db} from '../services/firebase';
import '../styles/chat.css';

function Chat(){

const [messages, setMessages] = useState('');
const [text, setText] = useState('');  
const [messagesLoading, setMessagesLoading] = useState(true);
const chatBox = useRef();

function makeid(length) {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

useEffect( ()=>{


  if(localStorage.getItem('userID') === null){
    localStorage.setItem('userID',makeid(6))
  }

    async function fetchData(){

    try {

        db.ref("chats").on("value", snapshot => {
        let chats = [];
        snapshot.forEach((snap) => {
          chats.push(snap.val());
        });
        setMessages(chats);
        setText('');
        
         setTimeout(() => {
        setMessagesLoading(false);
         }, 300);
        
        
        chatBox.current.scrollTop = chatBox.current.scrollHeight;
      });
    } catch (error) {
      alert('ошибка');
    }
  }
  fetchData();

}

  ,[])

  async function handleSubmit(event) {
    
    event.preventDefault();
    if(text.length === 0) return;
    console.log(messages);
    try {
      await db.ref("chats").push({
        userID: localStorage.getItem('userID'),
        content: text,
        timestamp: Date.now(),
      });
      // chatBox.current.scrollTop = chatBox.current.scrollHeight;
      console.log(chatBox.current)
      chatBox.current.childNodes[chatBox.current.childNodes.length - 1].scrollIntoView({block: "center", behavior: "smooth"});
   
    } catch (error) {
      alert('ошибка')
    }
  }

    return(
        <div className = 'main'>

        <div ref = {chatBox} className="messages">

        {messages && messages.map((mes)=>{
          return <div className = {(localStorage.getItem('userID') === mes.userID ? 'user ' : '')  + 'message' + (messagesLoading ? ' loading' : '') } key = {mes.timestamp}>{mes.content}</div>
          
        })}

        </div>


        <form action="">
        <textarea onKeyDown = {(e) => { if(e.key === 'Enter' && !e.shiftKey ) handleSubmit(e)}} placeholder = 'Message' onChange = {(e)=>{setText(e.target.value)}} value = {text} className = 'input_message' type="text" />
        {/* <div onChange = {(e)=>{setText(e.target.value)}} className = 'input_message' data-placeholder = 'Message' contentEditable = {true}> {text}</div> */}
        <button onClick = {
          (e) => {handleSubmit(e)}
        }>Send</button>
        </form>

        </div>
    )
}

export default Chat;
