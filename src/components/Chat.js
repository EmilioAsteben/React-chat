import { useState, useEffect, useRef } from 'react';
import {db} from '../services/firebase';
import '../styles/chat.css';


function Chat(){

const [fetchedMessages, setFetchedMessages] = useState('');
const [text, setText] = useState('');  
const [messagesLoading, setMessagesLoading] = useState(true);
const chatBox = useRef();



function generateID(length) {
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
    localStorage.setItem('userID',generateID(6))
  }

     function fetchData(){

    try {

         db.ref("messages").on("value", data => {
        let messages = [];
        data.forEach((message) => {
          messages.push(message.val());
        });
        setFetchedMessages(messages);
        setText('');
        
         setTimeout(() => {
        setMessagesLoading(false);
         }, 300);
        
        
        chatBox.current.scrollTop = chatBox.current.scrollHeight;
      });
    } catch (error) {
      alert(error);
    }
  }


  fetchData();

}

  ,[])



  async function handleSubmit(event) {
    
    event.preventDefault();
    if(text.length === 0) return;
    try {
      await db.ref("messages").push({
        userID: localStorage.getItem('userID'),
        content: text,
        timestamp: Date.now(),
      });
      chatBox.current.childNodes[chatBox.current.childNodes.length - 1] &&
      chatBox.current.childNodes[chatBox.current.childNodes.length - 1].scrollIntoView({block: "center", behavior: "smooth"});
   
    } catch (error) {
      alert(error)
    }
  }

    return(


        <div className = 'main'>

        <div ref = {chatBox} className="messages">

        {fetchedMessages && fetchedMessages.map((mes)=>{
          return <div className = {(localStorage.getItem('userID') === mes.userID ? 'user ' : '')  + 'message' + (messagesLoading ? ' loading' : '') } key = {mes.timestamp}>{mes.content}</div>
          
        })}

        </div>


        <div className="inputfooter">

        <textarea onTouchStart = {(e)=>{e.preventDefault()}} onKeyDown = {(e) => { if(e.key === 'Enter' && !e.shiftKey ) handleSubmit(e)}} placeholder = 'Message' onChange = {(e)=>{setText(e.target.value)}} value = {text} className = 'input_message' type="text" />
        
        <button onPointerDown = {
          (e) => {handleSubmit(e)}
        }       className = 'submit_button'>
              
                Send
        </button>


        </div>

        </div>
    )
}

export default Chat;
