package com.example.demo;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;


@Controller
public class MessageController {

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public String greeting(String name) throws Exception {
        return name + "!";
    }

    @MessageMapping("/message")
    @SendTo("/topic/chatroom")
    public Message chat(Message msg) throws Exception {
        return msg;
    }

    @MessageMapping("/bye")
    @SendTo("/topic/bye")
    public String bye(String msg) throws Exception {
        return msg + "!";
    }

}