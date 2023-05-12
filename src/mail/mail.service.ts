import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import e from 'express';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private config: ConfigService) {}

  async sendMail(email: string, subject: string, body: string): Promise<any> {
    const transporter = nodemailer.createTransport({
        
      host: this.config.get('HOST', 'smtp@gmail.com'),

      secure: this.config.get('SECURE'),

      auth: {
        user: this.config.get('EMAIL'),

        pass: this.config.get('PASSWORD'),
      },
    });

    const _rep = await transporter.sendMail({
        
      from: this.config.get('MAIL_FROM'),

      to: 'haseebb6@gmail.com',

      subject: `${subject}`,

      html: `${body}`,
    });

    if (_rep) {
      let msg = `A code has been send to your email `;

      throw new HttpException('success', HttpStatus.OK);
    }
  }
}
