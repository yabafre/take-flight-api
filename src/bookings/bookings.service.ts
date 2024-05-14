import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BookingsService {
  private stripe: Stripe;
  private prisma: PrismaService;

  constructor(configService: ConfigService) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-04-10',
    });
    this.prisma = new PrismaService();
  }

  async createBooking(bookingData: any) {
    try {
      const booking = await this.prisma.booking.create({
        data: bookingData,
      });
      return booking;
    } catch (error) {
      throw new HttpException(
        'An error occurred while creating the booking',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async processPayment(paymentData: any) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: paymentData.amount,
        currency: paymentData.currency,
        payment_method: paymentData.paymentMethodId,
        confirmation_method: 'manual',
        confirm: true,
      });
      return paymentIntent;
    } catch (error) {
      throw new HttpException(
        'An error occurred while processing the payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBooking(id: string) {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id },
      });
      return booking;
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching the booking',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
