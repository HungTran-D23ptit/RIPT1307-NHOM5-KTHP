import rootAPI from '../../rootAPI';
import { GetDevicesParams, GetDevicesResponse } from './typing';

export async function getDevices(params: GetDevicesParams) {
    return rootAPI.get<GetDevicesResponse>('/user/device', { params });
}

export type { GetDevicesParams, GetDevicesResponse }; 