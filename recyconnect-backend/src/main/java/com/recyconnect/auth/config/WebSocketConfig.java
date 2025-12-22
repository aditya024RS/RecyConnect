package com.recyconnect.auth.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // This is the endpoint the frontend will connect to for the WebSocket handshake.
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173") // Your frontend URL
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // These are the prefixes for messages sent from the client to the server.
        registry.setApplicationDestinationPrefixes("/app");

        // These are the prefixes for messages sent from the server to the client.
        // A '/queue' is typically used for one-to-one messaging.
        registry.enableSimpleBroker("/queue");
    }
}