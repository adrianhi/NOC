import nodemailer from "nodemailer";
import { envs } from "../../config/plugins/envs.plugin";
import { LogRepository } from "../../domain/repository/log.repository";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

interface Attachment {
  filename: string;
  path: string;
}
export class EmailService {
  constructor() {}

  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    },
  });

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments = [] } = options;

    try {
      const sentInformation = await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachments,
      });
      console.log(sentInformation);

      const log = new LogEntity({
        level: LogSeverityLevel.low,
        message: `Email sent`,
        origin: "email.service.ts",
      });
      return true;
    } catch (error) {
      const log = new LogEntity({
        level: LogSeverityLevel.high,
        message: `Email not sent`,
        origin: "email.service.ts",
      });
      return false;
    }
  }

  async SendEmailWithFileSystemLogs(to: string | string[]) {
    const subject = `Logs del servidor`;
    const htmlBody = `
      <h1>Logs del servidor</h1>
          <p>Hola,</p>
          <p>Adjunto encontrará los logs del servidor que ha solicitado:</p>
          <ul>
            <li>logs-all.log: Todos los logs</li>
            <li>logs-high.log: Logs de alta prioridad</li>
            <li>logs-medium.log: Logs de prioridad media</li>
          </ul>
          <p>Por favor, revise los archivos adjuntos para obtener más detalles.</p>
          <p>Saludos,<br/>El equipo de soporte</p>
    `;
    const attachments: Attachment[] = [
      { filename: "logs-all.log", path: "./logs/logs-all.log" },
      { filename: "logs-high.log", path: "./logs/logs-high.log" },
      { filename: "logs-medium.log", path: "./logs/logs-medium.log" },
    ];
    return this.sendEmail({
      to,
      subject,
      htmlBody,
      attachments,
    });
  }
}
