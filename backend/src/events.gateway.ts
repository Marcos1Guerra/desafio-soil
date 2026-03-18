import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Permite conexões do frontend
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // Método para enviar os dados atualizados para o frontend
  sendPivotUpdate(pivotId: string, data: any) {
    this.server.emit(`pivot-update-${pivotId}`, data);
    this.server.emit('dashboard-update', data); // Atualiza a visão geral
  }
}