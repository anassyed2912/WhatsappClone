import axios from 'axios';
const API = 'https://whatsappclone-2-rizq.onrender.com/api';
export const listConversations = () => axios.get(`${API}/conversations`).then(r=>r.data);
export const getConversation = (wa_id) => axios.get(`${API}/conversations/${encodeURIComponent(wa_id)}`).then(r=>r.data);
export const sendMessage = (wa_id, body, contact_name) => axios.post(`${API}/conversations/${encodeURIComponent(wa_id)}/messages`, { body, contact_name }).then(r=>r.data);
