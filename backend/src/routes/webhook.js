const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.post('/', async (req, res) => {
  try {
    let body = req.body || {};
    let messages = null;
    let statuses = null;
    let contacts = null;

    if (body.metaData?.entry?.[0]?.changes?.[0]?.value) {
      body = body.metaData.entry[0].changes[0].value;
    }


    if (body.messages) messages = body.messages;
    if (body.statuses) statuses = body.statuses;
    if (body.contacts) contacts = body.contacts;


    const v = body?.value || body; 
    if (!messages && v.messages) messages = v.messages;
    if (!statuses && v.statuses) statuses = v.statuses;
    if (!contacts && v.contacts) contacts = v.contacts;

    const io = req.app.locals?.io;

    if (!messages && !statuses) {
      return res.status(400).json({ error: 'No messages or statuses found in payload' });
    }

    let contact_name = null;
    if (contacts && Array.isArray(contacts) && contacts.length > 0) {
      contact_name = contacts[0]?.profile?.name || null;
    }


    if (messages && Array.isArray(messages)) {
      const inserted = [];
      for (const m of messages) {
        const id = m.id || m.message_id || m.meta_msg_id || ('msg-' + Date.now() + '-' + Math.random());
        const wa_id = (contacts && contacts[0] && contacts[0].wa_id) || m.from || m.recipient_id || m.to || 'unknown';
        const doc = {
          id: String(id),
          wa_id: String(wa_id),
          contact_name: contact_name,
          from: m.from || m.sender || m.recipient_id,
          to: m.to || m.recipient_id || null,
          body: m.text?.body || m.body || '',
          type: m.type || 'text',
          timestamp: m.timestamp ? new Date(parseInt(m.timestamp) * 1000) : new Date(),
          status: 'sent',
          raw: m
        };
        await Message.updateOne({ id: doc.id }, { $setOnInsert: doc }, { upsert: true });
        inserted.push(doc.id);
      }
      if (io) io.emit('new_messages', { ids: inserted });
    }


    if (statuses && Array.isArray(statuses)) {
      const updated = [];
      for (const s of statuses) {
        const refId = s.id || s.message_id || s.meta_msg_id || s.gs_id;
        if (!refId) continue;
        const status = s.status || 'delivered';
        const r = await Message.findOneAndUpdate({ id: String(refId) }, { $set: { status } });
        if (r) updated.push(refId);
      }
      if (io) io.emit('status_updates', { ids: updated });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
