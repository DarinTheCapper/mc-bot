const mineflayer = require('mineflayer');
const http = require('http');

// ==========================================
// 1. MINECRAFT BOT CONFIGURATION
// ==========================================
const bot = mineflayer.createBot({
  host: 'capcraftmc.aternos.me', // <-- Put your server IP here (e.g., 'my-server.aternos.me')
  port: 50597,            // Default Minecraft port
  username: 'Diddy', // The username your bot will use
  version: false          // 'false' allows mineflayer to auto-detect the server version
});

// Log when the bot successfully logs into the server
bot.on('spawn', () => {
  console.log('🤖 Bot has successfully joined the Minecraft server!');
});

// A simple educational chat feature: responds when someone says "hello"
bot.on('chat', (username, message) => {
  // Prevent the bot from responding to itself
  if (username === bot.username) return;

  if (message.toLowerCase() === 'hello') {
    bot.chat(`Hello ${username}! I am an educational bot running 24/7.`);
  }
});

// Handle errors so the script doesn't crash entirely
bot.on('error', (err) => {
  console.error('Error encountered:', err);
});

// Automatically try to reconnect if kicked or disconnected
bot.on('end', () => {
  console.log('Disconnected from server. Reconnecting in 10 seconds...');
  setTimeout(() => {
    // Exiting the process tells the cloud platform to restart the script immediately
    process.exit(1); 
  }, 10000);
});

// ==========================================
// 2. KEEP-ALIVE WEB SERVER (For Render)
// ==========================================
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is online and running!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌍 Keep-alive web server is listening on port ${PORT}`);
});