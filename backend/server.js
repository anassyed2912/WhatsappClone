const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./src/utils/db');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.locals.io = io;

app.use(cors());
app.use(express.json());

const webhook = require('./src/routes/webhook');
const api = require('./src/routes/api');

app.use('/webhook', webhook);
app.use('/api', api);


if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('disconnect', () => console.log('socket disconnected', socket.id));
});

const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  server.listen(PORT, () => console.log('Server listening on', PORT));
}).catch(err => { console.error(err); process.exit(1); });
