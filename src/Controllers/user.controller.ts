import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { User } from '../Entities/user.entity';
import { UserService } from '../Services/user.service';
import { OrderDirectionEnum } from '../Repositories/abstract.repository';
import { ListResult } from '../Types/type';
import { ActiveUserDto, AdminUserDto, CreateUserDto, UserDto } from '../Dto/user.dto';
import { JwtAuthGuard } from '../AuthGuard/jwt-auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Get('profile')
  profileAction(@Request() req): Promise<User> {
    return req.user;
  }

  @Post()
  async createAction(
    @Request() req,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return await this.userService.save(
      await this.userService.create(
        req.user.companyId,
        createUserDto,
      ),
    );
  }

  @Get(':username')
  async getUserAction(@Req() req, @Param('username') username: string): Promise<User> {
    return await this.userService.getByUsernameOrFail(req.user.companyId, username);
  }

  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'orderField', required: false, type: 'string' })
  @ApiQuery({ name: 'name', required: false, type: 'string' })
  @ApiQuery({ name: 'alias', required: false, type: 'string' })
  @ApiQuery({
    name: 'orderDirection',
    required: false,
    type: 'string',
    enum: OrderDirectionEnum,
  })
  @Get()
  async getUsersAction(
    @Request() req,
  ): Promise<ListResult<User>> {
    return this.userService.findInList(req.user.companyId, req.query);
  }

  @Patch(':username')
  async updateAction(
    @Request() req,
    @Body() userDto: UserDto,
    @Param('username') username: string,
  ) {
    return await this.userService.save(
      this.userService.update(
        await this.userService.getByUsernameOrFail(req.user.companyId, username),
        userDto,
      ),
    );
  }

  @Delete(':username')
  async deleteAction(
    @Request() req,
    @Param(':username') username: string,
  ) {
    await this.userService.save(
      this.userService.delete(
        await this.userService.getByUsernameOrFail(req.user.companyId, username),
      ),
    );
  }

  @Patch(':username/admin')
  async setAdminAction(
    @Request() req,
    @Body() adminUserDto: AdminUserDto,
    @Param('username') username: string,
  ): Promise<User> {
    return await this.userService.save(
      this.userService.setAdminUser(
        await this.userService.getByUsernameOrFail(req.user.companyId, username),
        adminUserDto,
      ),
    );
  }

  @Patch(':username/active')
  async setActiveAction(
    @Request() req,
    @Body() activeUserDto: ActiveUserDto,
    @Param('username') username: string,
  ) {
    return await this.userService.save(
      this.userService.setActive(
        await this.userService.getByUsernameOrFail(req.user.companyId, username),
        activeUserDto,
      ),
    );
  }
}
