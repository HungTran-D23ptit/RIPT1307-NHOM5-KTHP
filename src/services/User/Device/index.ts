import rootAPI from '../../rootAPI';
import { GetDevicesParams, GetDevicesResponse } from './typing';

export async function getDevices(params: GetDevicesParams) {
    return rootAPI.get<GetDevicesResponse>('/user/device', { params });
}

export async function getDeviceById(id: string) {
  return rootAPI.get(`/user/device/${id}`);
}

export type { GetDevicesParams, GetDevicesResponse }; 