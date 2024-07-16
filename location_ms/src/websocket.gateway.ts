import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors:true
})
export class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  @WebSocketServer()
  server: Server;

  private userSocket: Socket | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    if (this.userSocket) {
      this.clearUpdateInterval();
    }
    this.userSocket = client;
    this.startSendingLocation();
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    if (client === this.userSocket) {
      this.clearUpdateInterval();
      this.userSocket = null;
    }
  }

  @SubscribeMessage('register_user')
  handleRegisterUser(@ConnectedSocket() client: Socket) {
    this.userSocket = client;
    console.log('User registered for updates');
    this.startSendingLocation();
  }

  startSendingLocation() {
    const baseLatitude = 46.749245;
    const baseLongitude = 23.585616;
    const variance = 0.001;

    this.intervalId = setInterval(() => {
      const randomLat = baseLatitude + (Math.random() * variance * 2 - variance);
      const randomLong = baseLongitude + (Math.random() * variance * 2 - variance);

      const mockData = {
        deviceId: 'device123',
        latitude: randomLat,
        longitude: randomLong
      };
      this.handleLocationUpdate(mockData);
    }, 10000);
  }

  clearUpdateInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  handleLocationUpdate(data: { deviceId: string, latitude: number, longitude: number }) {
    console.log(data);
    console.log(`Received location from ${data.deviceId}: ${data.latitude}, ${data.longitude}`);
    if (this.userSocket) {
      this.userSocket.emit('update_location', data);
    }
  }
}
