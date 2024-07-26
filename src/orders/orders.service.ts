import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Orders Service');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected.');
  }

  create(createOrderDto: CreateOrderDto) {
    const order = this.order.create({ data: createOrderDto });
    return order;
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const totalPages = await this.order.count({});

    const currentPage = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;

    return {
      data: await this.order.findMany({
        where: { status: orderPaginationDto.status },
        skip: (currentPage - 1) * perPage,
        take: perPage
      }),
      meta: {
        totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage)
      }
    };
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({ where: { id } })
    if (!order) {
      throw new RpcException({
        message: `Order with id ${id} not found.`,
        status: HttpStatus.NOT_FOUND,
      });
    }
    return order;
  }

  changeStatus() {
    return `This action updates a  order`;
  }

  async findAllByStatus(id: string) {
    const order = await this.order.findFirst({ where: { id } })
    if (!order) {
      throw new RpcException({
        message: `Order with id ${id} not found.`,
        status: HttpStatus.NOT_FOUND,
      });
    }
    return order;
  }
}