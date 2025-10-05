import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

public class GmailSSLTest {
    public static void main(String[] args) {
        final String username = "mh1369080@gmail.com";
        final String password = "atmxbnlxbfsexcrl"; // your 16-char app password

        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "465");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(
                Message.RecipientType.TO, InternetAddress.parse("blaslomibao@gmail.com")
            );
            message.setSubject("Test Mail from Java");
            message.setText("Hello, this is a test email sent from Java via SSL (port 465).");

            Transport.send(message);
            System.out.println("Email sent successfully!");
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
