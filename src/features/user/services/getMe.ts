import { apiClient } from '../../../core/api';
import type { UserDto, ApiResponse } from '../types/user.dto';

export async function getMe(): Promise<UserDto> {
  const { data } = await apiClient.get<ApiResponse<UserDto>>('/auth/me');
  return data.data;
}
