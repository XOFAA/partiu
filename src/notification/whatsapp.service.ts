import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private readonly baseUrl = process.env.EVOLUTION_URL;
  private readonly instance = process.env.EVOLUTION_INSTANCE;
  private readonly token = process.env.EVOLUTION_API_KEY;

  async sendCode(phone: string, code: string) {
    const url = `${this.baseUrl}/message/sendText/${this.instance}`;

    await axios.post(
      url,
      {
        number: phone, // número no formato internacional: 5511999999999
        text: `Seu código de confirmação é: ${code}`,
      },
      {
        headers: { Authorization: `Bearer ${this.token}` },
      },
    );
  }
}
