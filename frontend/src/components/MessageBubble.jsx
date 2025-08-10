import React from 'react'

export default function MessageBubble({m}) {
  const isMe = m.from === 'me' || m.from === '918329446654' || m.from === 'Me';
  return (
    <div style={{display:'flex', flexDirection:isMe ? 'row-reverse' : 'row', marginBottom:8}}>
      <div className={`bubble ${isMe ? 'outgoing' : 'incoming'}`} style={{alignSelf: isMe ? 'flex-end' : 'flex-start'}}>
        <div style={{whiteSpace:'pre-wrap'}}>{m.body}</div>
        <div className="meta">{new Date(m.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} {m.status ? (' • ' + m.status) : ''}</div>
      </div>
    </div>
  )
}
