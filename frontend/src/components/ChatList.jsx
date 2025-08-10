import React from 'react'

export default function ChatList({conversations, onSelect, active}) {
  return (
    <div className="sidebar">
      <div className="topbar">
        <div className="avatar">H</div>
        <div style={{flex:1}}>
          <div className="title">WhatsApp</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <div style={{width:36, height:36, borderRadius:18, background:'#128C7E'}}></div>
          <div style={{width:36, height:36, borderRadius:18, background:'#128C7E'}}></div>
        </div>
      </div>
      <div className="search"><input placeholder="Search or start new chat" /></div>
      <div className="chat-list">
        {conversations.map(c => (
          <div key={c.wa_id} className="chat-item" onClick={() => onSelect(c.wa_id)} style={{background: active===c.wa_id ? '#f7fff9' : 'transparent'}}>
            <div className="avatar">{(c.name || c.wa_id || '').slice(0,1)}</div>
            <div className="chat-meta">
              <div className="chat-top">
                <div className="chat-name">{c.name || c.wa_id}</div>
                <div style={{fontSize:12, color:'#6b7280'}}>{c.lastMessage ? new Date(c.lastMessage.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}</div>
              </div>
              <div className="chat-preview">{c.lastMessage ? (c.lastMessage.body || '').slice(0,60) : 'No messages'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
