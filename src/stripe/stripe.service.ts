// src/stripe/stripe.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
     
    });
  }

  async createProduct(name: string, description?: string) {
    return this.stripe.products.create({
      name,
      description,
    });
  }

  async createPrice(productId: string, unitAmount: number, currency = 'brl') {
    return this.stripe.prices.create({
      product: productId,
      unit_amount: unitAmount,
      currency,
    });
  }

async createPaymentIntent(
  amount: number,
  currency = 'brl',
  paymentMethods?: Array<'card' | 'pix' | 'boleto'>,
) {
  const params: Stripe.PaymentIntentCreateParams = {
    amount,
    currency,
  };

  if (paymentMethods) {
    params.payment_method_types = paymentMethods;
  }

  return this.stripe.paymentIntents.create(params);
}

}
