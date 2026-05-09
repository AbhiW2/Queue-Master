package com.example.Queue_Master.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    /**
     * Sends the OTP email asynchronously so the HTTP response
     * is NOT held waiting for SMTP to complete.
     */
    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("QueueMaster — Password Reset OTP");
            helper.setFrom("wabhijeet157@gmail.com");
            helper.setText(buildOtpEmailHtml(otp), true); // true = HTML

            mailSender.send(message);
            log.info("OTP email sent to: {}", toEmail);

        } catch (MessagingException | MailException e) {
            // Log the error but don't expose it to the caller.
            // The service layer already persisted the OTP, so a
            // delivery failure is logged here and the user sees a
            // generic "if this email exists, an OTP was sent" message.
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildOtpEmailHtml(String otp) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
              <title>Password Reset</title>
            </head>
            <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0"
                     style="background:#f3f4f6;padding:32px 0;">
                <tr>
                  <td align="center">
                    <table width="520" cellpadding="0" cellspacing="0"
                           style="background:#ffffff;border-radius:12px;
                                  overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

                      <!-- Header -->
                      <tr>
                        <td style="background:#1e40af;padding:28px 40px;text-align:center;">
                          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;
                                     letter-spacing:-.3px;">
                            QueueMaster
                          </h1>
                          <p style="margin:4px 0 0;color:#bfdbfe;font-size:13px;">
                            Queue Management System
                          </p>
                        </td>
                      </tr>

                      <!-- Body -->
                      <tr>
                        <td style="padding:36px 40px 28px;">
                          <h2 style="margin:0 0 12px;font-size:20px;color:#111827;
                                     font-weight:600;">
                            Password Reset Request
                          </h2>
                          <p style="margin:0 0 24px;color:#6b7280;font-size:14px;
                                     line-height:1.6;">
                            We received a request to reset your QueueMaster password.
                            Use the one-time code below to proceed. This code is valid
                            for <strong style="color:#111827;">10 minutes</strong>.
                          </p>

                          <!-- OTP Box -->
                          <table width="100%%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center">
                                <div style="display:inline-block;background:#f0f9ff;
                                            border:2px solid #bfdbfe;border-radius:10px;
                                            padding:18px 40px;margin:0 auto;">
                                  <p style="margin:0 0 4px;font-size:12px;color:#3b82f6;
                                             font-weight:600;letter-spacing:.8px;
                                             text-transform:uppercase;">
                                    Your OTP Code
                                  </p>
                                  <p style="margin:0;font-size:38px;font-weight:700;
                                             letter-spacing:10px;color:#1e40af;
                                             font-family:'Courier New',monospace;">
                                    %s
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </table>

                          <p style="margin:24px 0 0;color:#9ca3af;font-size:12px;
                                     line-height:1.6;text-align:center;">
                            If you did not request a password reset, please ignore this email.
                            Your password will not be changed.
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background:#f9fafb;padding:16px 40px;
                                   border-top:1px solid #e5e7eb;">
                          <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;">
                            © %d QueueMaster Technologies Pvt. Ltd. · This is an automated message.
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(otp, java.time.Year.now().getValue());
    }
}













