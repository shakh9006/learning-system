import { TokensResult } from '../../../internal/tokens/types/TokensResult';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class RegisterLoginAuthResponseDto {
  tokens: TokensResult;
  user: UserResponseDto;
}
