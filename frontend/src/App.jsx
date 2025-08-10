import React, {useEffect, useState} from 'react'
import ChatList from './components/ChatList'
import ChatWindow from './components/ChatWindow'
import { listConversations } from './api'

export default function App(){
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [activeName, setActiveName] = useState('');

  useEffect(() => { fetchList(); }, []);

  const fetchList = async () => {
    const data = await listConversations();
    setConversations(data);
    if (!active && data.length) {
      setActive(data[0].wa_id);
      setActiveName(data[0].name);
    }
  }

  const handleSelect = (wa_id) => {
    const conv = conversations.find(c => c.wa_id === wa_id);
    setActive(wa_id);
    setActiveName(conv?.name || wa_id);
  }

  return (
    <div className="app">
      <ChatList conversations={conversations} onSelect={handleSelect} active={active} />
      <ChatWindow wa_id={active} name={activeName} />
    </div>
  )
}
