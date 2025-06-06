import rootAPI from '../../rootAPI';

export async function getUserProfile() {
  return rootAPI.get('/user/profile');
}

export async function updateUserProfile(data: any) {
  return rootAPI.put('/user/profile', data);
} 