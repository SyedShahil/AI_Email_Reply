package com.email.emailwriter.emailcontroller;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EmailGeneratorService {
    private final WebClient webClient;
    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;
    public EmailGeneratorService(WebClient.Builder webClientbBuilder){
        this.webClient=webClientbBuilder.build();
    }
    public String generateEmailReply(EmailRequest emailRequest){
        String prompt=BuildPrompt(emailRequest);
        Map<String,Object> requestBody=Map.of("contents",new Object[]{
            Map.of("parts",new Object[]{
                Map.of("text",prompt)
            })
        });

       String response = webClient.post()
    .uri(geminiApiUrl + "?key=" + geminiApiKey)
    .bodyValue(requestBody)
    .retrieve()
    .bodyToMono(String.class)
    .doOnError(error -> System.err.println("Failed to generate email reply: " + error.getMessage()))
    .block();


        return extractResponseContent(response);


    }
    private String extractResponseContent(String response){
        try{
            ObjectMapper mapper=new ObjectMapper();
            JsonNode rootNode=mapper.readTree(response);
            return rootNode.path("candidates")
                            .get(0)
                            .path("content")
                            .path("parts")
                            .get(0)
                            .get("text")
                            .asText();
        }
        catch(Exception e){
            return "Error processing rrequest"+e.getMessage();
        }
    }
    private String  BuildPrompt(EmailRequest emailRequest){
        StringBuilder prompt=new StringBuilder();
        prompt.append("Generate a professional email reply content.please dont genetate a subject line");
        if(emailRequest.getTone()!=null || !emailRequest.getTone().isEmpty()){
            prompt.append("Use a ").append(emailRequest.getTone()).append("tone. ");
        }
        prompt.append("\n Original email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
