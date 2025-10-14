import { resendClient, sender } from "../lib/resend";
import { createWelcomeEmailTemplate } from "../emails/emailTemplates";

export const sendWelcomeEmail = async (email: string, name: string, clientURL: string) => {
   const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Chat-App!",
    html: createWelcomeEmailTemplate(name, clientURL),
   });

   if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
   } else {
    console.log("Welcome email sent successfully:", data);
   }
};

