const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, 
  wa_id: { type: String, required: true },
  contact_name: { type: String },
  from: String,
  to: String,
  body: String,
  type: String,
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['created','sent','delivered','read'], default: 'created' },
  raw: Object
});

module.exports = mongoose.model('Message', MessageSchema);
