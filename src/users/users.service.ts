// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { CreateUserType } from '@/users/dto/create-user.type';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: string): Promise<CreateUserType> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(userData: any): Promise<CreateUserType> {
    const parsedData = CreateUserDto.parse({
      ...userData,
      providers: userData.raw_app_meta_data ?? {}, // Extract providers from raw_app_meta_data
    });

    return this.prisma.user.create({
      data: {
        ...parsedData,
        email: parsedData.email, // Add the email property
        providers: {
          createMany: {
            data: parsedData.providers?.providers?.map((p) => ({
              provider: p,
            })),
          },
        },
      },
    });
  }

  async updateUser(id: string, userData: any): Promise<CreateUserType> {
    // First, check if the user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error(`User with ID ${id} not found`);
    }

    const parsedData = CreateUserDto.parse({
      ...userData,
      providers: userData.raw_app_meta_data ?? {}, // Extract providers from raw_app_meta_data
    });

    return this.prisma.user.update({
      where: { id: id },
      data: {
        ...parsedData,
        email: parsedData.email,
        providers: {
          deleteMany: {
            userId: id,
          },
          createMany: {
            data: parsedData.providers?.providers?.map((p) => ({
              provider: p,
            })),
          },
        },
      },
    });
  }

  async deleteUser(id: string): Promise<CreateUserType> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
