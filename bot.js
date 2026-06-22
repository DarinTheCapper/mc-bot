const mineflayer = require('mineflayer');
const http = require('http');

let bot;
let afkInterval;

// Put the server IP or a direct numerical IP address here
const SERVER_HOST = 'capcraftmc.aternos.me'; // A standard public server that allows datacenter traffic
const SERVER_PORT = 50597;

function createMinecraftBot() {
  console.log('⏳ Waiting 5 seconds for network stabilization...');
  
  setTimeout(() => {
    console.log(`🔌 Attempting to connect to ${SERVER_HOST}...`);
    
    bot = mineflayer.createBot({
      host: SERVER_HOST,
      port: SERVER_PORT,
      username: 'Diddy',
      version: false
    });

    // Log when the bot successfully logs into the server
    bot.on('spawn', () => {
      console.log('🤖 Bot has successfully joined the Minecraft server!');
      
      clearInterval(afkInterval);
      afkInterval = setInterval(() => {
        if (bot && bot.entity) {
          bot.setControlState('jump', true);
          setTimeout(() => {
            if (bot && bot.entity) bot.setControlState('jump', false);
          }, 500);
          console.log('🦘 Anti-AFK Jump triggered.');
        }
      }, 60000);
    });

    // Simple chat responder
    bot.on('chat', (username, message) => {
      if (username === bot.username) return;
      if (message.toLowerCase() === 'hello') {
        bot.chat(`Hello ${username}! I am an educational bot running 24/7.`);
      }
    });

    // Handle errors safely without crashing the script entirely
    bot.on('error', (err) => {
      console.error('⚠️ Error encountered:', err.message);
    });

    // Automatically try to reconnect safely if kicked
    bot.on('end', (reason) => {
      console.log(`Disconnected from server. Reason: ${reason}`);
      clearInterval(afkInterval);
      
      console.log('Reconnecting in 20 seconds...');
      setTimeout(() => {
        process.exit(1); // Force a clean restart via Render's process manager
      }, 20000);
    });

  }, 5000); // 5-second initial delay
}

// Start the connection process
createMinecraftBot();

// ==========================================
// 2. KEEP-ALIVE WEB SERVER (For Render)
// ==========================================
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot environment is running stable!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌍 Keep-alive web server is listening on port ${PORT}`);
});