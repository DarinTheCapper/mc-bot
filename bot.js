const mineflayer = require('mineflayer');
const http = require('http');

// ==========================================
// 1. MINECRAFT BOT CONFIGURATION
// ==========================================
const bot = mineflayer.createBot({
  host: 'public.mineflayer.com', // <-- Make sure to put your server IP here
  port: 50597,
  username: 'Diddy',
  version: false
});

let afkInterval;

// Log when the bot successfully logs into the server
bot.on('spawn', () => {
  console.log('🤖 Bot has successfully joined the Minecraft server!');
  
  // ANTI-AFK FEATURE: Jumps every 60 seconds to prevent getting kicked
  clearInterval(afkInterval); // Clear any old intervals
  afkInterval = setInterval(() => {
    if (bot && bot.entity) {
      bot.setControlState('jump', true);
      setTimeout(() => {
        if (bot && bot.entity) bot.setControlState('jump', false);
      }, 500);
      console.log('🦘 Anti-AFK Jump triggered.');
    }
  }, 60000); // 60000ms = 1 minute
});

// Simple chat responder
bot.on('chat', (username, message) => {
  if (username === bot.username) return;

  if (message.toLowerCase() === 'hello') {
    bot.chat(`Hello ${username}! I am an educational bot running 24/7.`);
  }
});

// Handle errors
bot.on('error', (err) => {
  console.error('Error encountered:', err);
});

// Automatically try to reconnect safely if kicked
bot.on('end', (reason) => {
  console.log(`Disconnected from server. Reason: ${reason}`);
  clearInterval(afkInterval); // Stop trying to jump while offline
  
  console.log('Reconnecting in 15 seconds...');
  setTimeout(() => {
    // Force exit so Render fully restarts the script container cleanly
    process.exit(1); 
  }, 15000);
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