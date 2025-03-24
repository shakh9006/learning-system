import { Controller, Get, UseGuards } from '@nestjs/common';
import { SpeakersService } from './speakers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('speakers')
export class SpeakersController {
  constructor(private readonly speakersService: SpeakersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const result = await this.speakersService.findAll();

    return {
      success: true,
      message: 'Successfully retrieved speakers',
      data: result,
    };
  }
}
