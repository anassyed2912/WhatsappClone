import React, {useState, useEffect, useRef} from 'react'
import MessageBubble from './MessageBubble'
import { getConversation, sendMessage } from '../api'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000'

export default function ChatWindow({wa_id, name}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const boxRef = useRef();
  useEffect(() => {
    if (!wa_id) return;
    getConversation(wa_id).then(setMessages);
  }, [wa_id]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on('new_messages', (data) => {
      if (wa_id) getConversation(wa_id).then(setMessages);
    });
    socket.on('status_updates', (data) => {
      if (wa_id) getConversation(wa_id).then(setMessages);
    });
    return () => socket.disconnect();
  }, [wa_id]);

  useEffect(() => { if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight; }, [messages]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = await sendMessage(wa_id, text.trim(), name);
    setText('');
    setMessages(prev => [...prev, msg]);
  };

  if (!wa_id) return <div className="chat-window" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>Select a chat</div>;

  return (
    <div className="chat-window" style={{display:'flex', flexDirection:'column'}}>
      <div className="window-header">
        <div className="avatar">{(name||'U').slice(0,1)}</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700}}>{name}</div>
          <div style={{fontSize:12, color:'#cfeadf'}}>online</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <div style={{width:36, height:36, borderRadius:18, background:'rgba(255,255,255,0.12)'}}></div>
        </div>
      </div>
      <div className="messages" ref={boxRef}>
        {messages.map(m => <MessageBubble key={m.id} m={m} />)}
      </div>
      <form className="input-area" onSubmit={submit}>
        <div style={{width:42, height:42, borderRadius:21, background:'#f1f3f4', display:'flex', alignItems:'center', justifyContent:'center'}}>😊</div>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message" />
        <button type="submit" className="send-btn">➤</button>
      </form>
    </div>
  )
}
