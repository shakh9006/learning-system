import { Injectable } from '@nestjs/common';
import { SpeakersRepository } from './speakers.repository';

@Injectable()
export class SpeakersService {
  constructor(private readonly speakersRepository: SpeakersRepository) {}

  async findAll() {
    return await this.speakersRepository.findAll();
  }
}
