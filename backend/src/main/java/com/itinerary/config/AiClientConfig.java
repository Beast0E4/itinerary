package com.itinerary.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Configuration
public class AiClientConfig {

    /** Used by the legacy synchronous /plan relay. */
    @Bean
    public RestTemplate aiRestTemplate(RestTemplateBuilder builder) {
        return builder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(60))
                .build();
    }

    /**
     * Used by the streaming /plan/stream relay. Read timeout is
     * intentionally NOT set on the underlying connection -- an SSE
     * stream is expected to stay open and emit events over time. The
     * overall stream duration is instead bounded in
     * AiPlannerServiceImpl.streamPlan() via a reactive .timeout()
     * operator, which lets us emit a clean "error" SSE event to the
     * browser on timeout instead of the connection just dying silently.
     */
    @Bean
    public WebClient aiWebClient() {
        HttpClient httpClient = HttpClient.create()
                .responseTimeout(null) // no hard cap here; see streamPlan()'s .timeout()
                .option(io.netty.channel.ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000);

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}