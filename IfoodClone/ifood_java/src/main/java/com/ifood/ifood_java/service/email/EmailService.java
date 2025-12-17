package com.ifood.ifood_java.service.email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmail(String para, String assunto, String conteudoHtml) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(para);
            helper.setSubject(assunto);
            helper.setText(conteudoHtml, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar email");
        }
    }
}
