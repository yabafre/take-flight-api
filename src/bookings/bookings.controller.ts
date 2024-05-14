import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { BookingsService } from '@/bookings/bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(@Body() bookingData: any) {
    try {
      const booking = await this.bookingsService.createBooking(bookingData);
      return booking;
    } catch (error) {
      const message =
        error.message || 'An error occurred while creating the booking';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      console.error(error);
      throw new HttpException(message, status);
    }
  }

  @Post('payment')
  async processPayment(@Body() paymentData: any) {
    try {
      const payment = await this.bookingsService.processPayment(paymentData);
      return payment;
    } catch (error) {
      const message =
        error.message || 'An error occurred while processing the payment';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      console.error(error);
      throw new HttpException(message, status);
    }
  }

  @Get(':id')
  async getBooking(@Param('id') id: string) {
    try {
      const booking = await this.bookingsService.getBooking(id);
      return booking;
    } catch (error) {
      const message =
        error.message || 'An error occurred while fetching the booking';
      const status =
        error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      console.error(error);
      throw new HttpException(message, status);
    }
  }
}
