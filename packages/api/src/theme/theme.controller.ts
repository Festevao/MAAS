import { Controller, Get } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { Public } from 'src/auth/guards/public.guard';
import { ApiTags } from '@nestjs/swagger';
import { ThemeResponseDTO } from './dto/theme-response.dto';

@ApiTags('Themes')
@Controller('theme')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Public()
  @Get()
  async getAllThemes() {
    const result = (await this.themeService.findAll()).map((value) => new ThemeResponseDTO(value));
    return result;
  }
}
