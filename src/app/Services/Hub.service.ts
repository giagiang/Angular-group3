import {  Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@aspnet/signalr';
import { IHttpConnectionOptions } from '@aspnet/signalr';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HubService {
  hubUrl = environment.hubUrl;
  hubConnection!: signalR.HubConnection;
  status: boolean = false;
  constructor(private router: Router) {
  }
  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop().catch(error => console.log(error));
    }
  }

  public initiateSignalrConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      const options: IHttpConnectionOptions = {
        accessTokenFactory: () => {
          return sessionStorage.getItem('token') ?? '';
        },
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      };
      this.hubConnection = new signalR.HubConnectionBuilder().withUrl(this.hubUrl, options).build();
      this.hubConnection.start().then(() => {
        this.status = (true);
        resolve();
      }).catch(e => {
        reject()
      });
    })
  }


}
