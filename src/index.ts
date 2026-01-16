import axios from "axios";
import { config } from "./config";
import WebSocket from 'ws';

interface IRSCHSMessage {
  message: string;
  date: Date;
  type: 'start' | 'stop'
}

function connectRschsClient() {
  const ws = new WebSocket(`https://${config.rschs.domain}/ws`);

  ws.on('open', () => {
    console.log('✅ Подключено к RSCHS');
  })

  ws.on('error', (error) => {
    console.log('❌ Ошибка RSCHS', error.message)
  })

  ws.on('close', () => {
    console.log('🔌 Соединение к RSCHS закрыто. Переподключение через 5 сек...');
    setTimeout(connectRschsClient, 5000);
  })

  ws.on('message', (data: WebSocket.Data) => {
    let json: IRSCHSMessage | null = null
    try {
      json = JSON.parse(data.toString()) as IRSCHSMessage
    } catch {
      console.log('⚠️ RSCHS. Не удалось распарсить сообщение', data.toString())
    }

    if (!json) return

    const cleanMessage = json.message.replaceAll(config.rschs.replace, '');
    const finalMessage = cleanMessage.length > 189 ? cleanMessage.slice(0, 189) + '...' : cleanMessage;

    console.log(finalMessage)
    axios.post(`https://${config.meshmonitor.domain}/api/v1/messages`, {
      text: `[RSCHS] ${finalMessage}`,
      channel: config.meshmonitor.channel
    }, {
      headers: {
        'Authorization': config.meshmonitor.token
      }
    })
  })
}

connectRschsClient()