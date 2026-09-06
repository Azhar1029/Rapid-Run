package com.rapidrun.execution.service;

import com.rapidrun.execution.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExecutionService {

    private final RestTemplate restTemplate;

    @Value("${judge0.url}")
    private String judge0Url;

    @Value("${judge0.api-key:}")
    private String apiKey;

    private static final Map<String, Integer> LANG_IDS = Map.of(
        "java", 62, "c", 50, "cpp", 54, "python", 71
    );

    public ExecutionResponse execute(ExecutionRequest req) {
        Integer langId = LANG_IDS.get(req.getLanguage().toLowerCase());
        if (langId == null) throw new IllegalArgumentException("Unsupported language: " + req.getLanguage());

        long start = System.currentTimeMillis();

        Judge0Request judge0Req = Judge0Request.builder()
            .sourceCode(req.getCode())
            .languageId(langId)
            .stdin(req.getStdin() != null ? req.getStdin() : "")
            .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (!apiKey.isBlank()) {
            headers.set("X-RapidAPI-Key", apiKey);
            headers.set("X-RapidAPI-Host", "judge0-ce.p.rapidapi.com");
        }

        HttpEntity<Judge0Request> entity = new HttpEntity<>(judge0Req, headers);

        // Submit
        String submitUrl = judge0Url + "/submissions?base64_encoded=false&wait=false";
        ResponseEntity<Map> submitRes = restTemplate.postForEntity(submitUrl, entity, Map.class);
        String token = (String) submitRes.getBody().get("token");

        // Poll
        for (int i = 0; i < 15; i++) {
            try { Thread.sleep(1000); } catch (InterruptedException ignored) {}

            String pollUrl = judge0Url + "/submissions/" + token + "?base64_encoded=false";
            ResponseEntity<Judge0Response> pollRes = restTemplate.exchange(
                pollUrl, HttpMethod.GET, new HttpEntity<>(headers), Judge0Response.class);

            Judge0Response result = pollRes.getBody();
            if (result == null || result.getStatus() == null) continue;

            int statusId = result.getStatus().getId();
            if (statusId <= 2) continue; // In Queue / Processing

            String elapsed = String.format("%.2f", (System.currentTimeMillis() - start) / 1000.0);
            String stderr = "";
            if (result.getStderr() != null) stderr += result.getStderr();
            if (result.getCompileOutput() != null) stderr += result.getCompileOutput();

            return ExecutionResponse.builder()
                .stdout(result.getStdout() != null ? result.getStdout() : "")
                .stderr(stderr)
                .exitCode(statusId == 3 ? 0 : 1)
                .elapsed(elapsed)
                .build();
        }
        throw new RuntimeException("Execution timed out");
    }
}
