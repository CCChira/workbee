import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket, MessageBody, OnGatewayInit
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private userSocket: Socket | null = null; // Socket for the single user

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('register_user')
  handleRegisterUser(@ConnectedSocket() client: Socket) {
    // Assuming the single user sends a specific message to register
    this.userSocket = client;
    console.log('User registered for updates');
  }

  @SubscribeMessage('send_location')
  handleLocationUpdate(@MessageBody() data: { deviceId: string, latitude: number, longitude: number }) {
    console.log(data);
    console.log(`Received location from ${data.deviceId}: ${data.latitude}, ${data.longitude}`);
    // Send data to the single user, if registered
    if (this.userSocket) {
      this.userSocket.emit('update_location', data);
    }
  }
}