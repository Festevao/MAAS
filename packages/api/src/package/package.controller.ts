import { Body, Controller, Get, Post } from '@nestjs/common';
import { PackageService } from './package.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PackageResponseDTO } from './dto/package-response.dto';
import { TokenPayload } from 'src/core/annotations/TokenPayload';
import { JWTPayload } from 'src/auth/types/JwtPayload';
import { CreatePackageDTO } from './dto/create-package.dto';

@ApiTags('Packages')
@ApiSecurity('Auth')
@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get()
  async getAllByUser(
    @TokenPayload() payload: JWTPayload,
  ) {
    const result = (await this.packageService.getAllByUser(payload.sub)).map((item) => new PackageResponseDTO(item));
    return result;
  }

  @Post()
  async createByUser(
    @TokenPayload() payload: JWTPayload,
    @Body() createPackageDTO: CreatePackageDTO,
  ) {
    await this.packageService.createByUser(payload.sub, createPackageDTO);
  }
}
