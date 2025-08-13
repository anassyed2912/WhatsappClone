import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { getConversation, sendMessage } from '../api';
import { io } from 'socket.io-client';
import { FaSmile, FaPaperclip, FaMicrophone, FaPaperPlane } from 'react-icons/fa';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export default function ChatWindow({ wa_id, name }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef(null);
  const boxRef = useRef();

  useEffect(() => {
    if (!wa_id) return;
    getConversation(wa_id).then(setMessages);
  }, [wa_id]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on('new_messages', () => {
      if (wa_id) getConversation(wa_id).then(setMessages);
    });
    socket.on('status_updates', () => {
      if (wa_id) getConversation(wa_id).then(setMessages);
    });
    return () => socket.disconnect();
  }, [wa_id]);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = await sendMessage(wa_id, text.trim(), name);
    setText('');
    setMessages((prev) => [...prev, msg]);
  };

  if (!wa_id)
    return (
      <div className="chat-window" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Select a chat
      </div>
    );

  return (
    <div className="chat-window" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="window-header">
        <div className="avatar">{(name || 'U').slice(0, 1)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#cfeadf' }}>online</div>
        </div>
      </div>

      <div className="messages" ref={boxRef}>
        {messages.map((m) => (
          <MessageBubble key={m.id} m={m} />
        ))}
      </div>

      <form className="input-area" onSubmit={submit} style={{ position: 'relative' }}>
        <button type="button" className="icon-btn" onClick={() => setShowEmoji((prev) => !prev)}>
          <FaSmile />
        </button>
        {showEmoji && (
          <div style={{ position: 'absolute', bottom: '60px', left: '10px', zIndex: 1000 }}>
            <Picker data={data} onEmojiSelect={(e) => setText((prev) => prev + e.native)} />
          </div>
        )}
        <button type="button" className="icon-btn" onClick={() => fileInputRef.current.click()}>
          <FaPaperclip />
        </button>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" />
        {text.trim() ? (
          <button type="submit" className="send-btn">
            <FaPaperPlane />
          </button>
        ) : (
          <button type="button" className="send-btn">
            <FaMicrophone />
          </button>
        )}
      </form>
    </div>
  );
}
