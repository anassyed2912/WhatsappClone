const express = require('express');
const router = express.Router();
const Message = require('../models/Message');


router.get('/conversations', async (req, res) => {
  const msgs = await Message.find().sort({ timestamp: -1 }).lean();
  const groups = {};
  msgs.forEach(m => {
    const key = m.wa_id;
    if (!groups[key]) groups[key] = { wa_id: key, messages: [], name: m.contact_name || null };
    if (m.contact_name) groups[key].name = m.contact_name;
    groups[key].messages.push(m);
  });
  const arr = Object.values(groups).map(g => ({
    wa_id: g.wa_id,
    name: g.name || g.wa_id,
    lastMessage: g.messages[0],
    messagesCount: g.messages.length
  })).sort((a,b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp));
  res.json(arr);
});


router.get('/conversations/:wa_id', async (req, res) => {
  const wa_id = req.params.wa_id;
  const msgs = await Message.find({ wa_id }).sort({ timestamp: 1 }).lean();
  res.json(msgs);
});


router.post('/conversations/:wa_id/messages', async (req, res) => {
  const wa_id = req.params.wa_id;
  const { body, from='me', type='text' } = req.body;
  const id = 'local-' + Date.now();
  const msg = await Message.create({ id, wa_id, contact_name: req.body.contact_name || null, from, to: wa_id, body, type, status: 'sent', timestamp: new Date() });
  const io = req.app.locals && req.app.locals.io;
  if (io) io.emit('new_messages', { ids: [msg.id], message: msg });
  res.status(201).json(msg);
});

module.exports = router;
