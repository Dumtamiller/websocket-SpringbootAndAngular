import { Component } from "@angular/core";
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
var stompClient = null;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "simple-chat";
  name: string = "";
  chat: string = "";
  content : string ="";
  buttonState: boolean = false;
  private stompClient;

  connect() {
    var socket = new SockJS("http://localhost:8888/gs-guide-websocket");
    stompClient = Stomp.over(socket);
    stompClient.connect(
      {},
      function() {
        stompClient.subscribe(
          "/topic/greetings",
          function(greeting) {
            this.buttonState = true;
            this.chat += `<tr><td> ${greeting.body} join in chatroom </td></tr>`;
          }.bind(this)
        );

        stompClient.subscribe("/topic/chatroom", greeting => {
          const data = JSON.parse(greeting.body);
          this.chat += `<tr><td> ${data.name}  Say : ${data.content}</td></tr>`;
        });

        stompClient.subscribe("/topic/bye", greeting => {
          this.chat += `<tr><td> ${greeting.body} left from chatroom</td></tr>`;
        });

        stompClient.send("/app/hello", {}, this.name);
      }.bind(this)
    );

    this.stompClient = stompClient;
  }

  disconnect() {
    this.stompClient.send("/app/bye", {},this.name);
    this.stompClient.disconnect();
    this.buttonState = false;
  }

  sendMessage() {
    const data = {
      name : this.name,
      content : this.content,
    }
    this.stompClient.send("/app/message", {}, JSON.stringify(data));
  }
}
