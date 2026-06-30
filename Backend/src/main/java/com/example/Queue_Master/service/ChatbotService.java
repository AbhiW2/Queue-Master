package com.example.Queue_Master.service;

import com.example.Queue_Master.entity.Branch;
import com.example.Queue_Master.entity.Token;
import com.example.Queue_Master.entity.UserNotification;
import com.example.Queue_Master.repository.BranchRepository;
import com.example.Queue_Master.repository.TokenRepository;
import com.example.Queue_Master.repository.UserNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final ChatClient.Builder builder;
    private final TokenRepository tokenRepository;
    private final BranchRepository branchRepository;
    private final UserNotificationRepository notificationRepository;

    @Value("${chatbot.system-prompt}")
    private String systemPrompt;

    public String chat(String userMessage, Long userId) {

        String msg = userMessage.toLowerCase();
        StringBuilder context = new StringBuilder();

        // ── User's active tokens ──────────────────────────────────────────
        if (msg.contains("token") || msg.contains("booking") ||
                msg.contains("status") || msg.contains("cancel") ||
                msg.contains("queue") || msg.contains("my")) {

            List<Token> tokens = tokenRepository
                    .findActiveTokensByUserId(userId, LocalDate.now());

            context.append("User's active tokens:\n");
            if (tokens.isEmpty()) {
                context.append("No active tokens.\n");
            } else {
                for (Token t : tokens) {
                    context.append("- Token ").append(t.getDisplayToken())
                            .append(" | Date: ").append(t.getBookingDate())
                            .append(" | Status: ").append(t.getStatus())
                            .append(" | Shift: ").append(t.getShiftType())
                            .append(" | Branch: ").append(t.getBranch().getName());
                    if (t.getDoctor() != null)
                        context.append(" | Doctor: ").append(t.getDoctor().getName());
                    if (t.getBranchService() != null)
                        context.append(" | Service: ").append(t.getBranchService().getName());
                    if (t.getScheduledTime() != null)
                        context.append(" | Time: ").append(t.getScheduledTime());
                    context.append("\n");
                }
            }
        }

        // ── Branches ──────────────────────────────────────────────────────
        if (msg.contains("branch") || msg.contains("location") ||
                msg.contains("where") || msg.contains("available") ||
                msg.contains("book")) {

            List<Branch> branches = branchRepository.findAll();
            context.append("\nAvailable branches:\n");
            for (Branch b : branches) {
                context.append("- ").append(b.getName())
                        .append(" | Location: ").append(b.getLocation())
                        .append("\n");
            }
        }

        // ── Notifications ─────────────────────────────────────────────────
        if (msg.contains("notification") || msg.contains("alert") ||
                msg.contains("update") || msg.contains("message")) {

            List<UserNotification> notifs =
                    notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);

            context.append("\nUser notifications (latest 5):\n");
            notifs.stream().limit(5).forEach(n ->
                    context.append("- ").append(n.getMessage())
                            .append(" (").append(n.getCreatedAt()).append(")\n")
            );
        }

        // ── Build prompt and call Ollama ──────────────────────────────────
        String fullSystem = systemPrompt
                + (context.length() > 0
                ? "\n\nCurrent user data from the system:\n" + context
                : "");

        return builder.build()
                .prompt()
                .system(fullSystem)
                .user(userMessage)
                .call()
                .content();
    }
}