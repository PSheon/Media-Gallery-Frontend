// ** Utils Imports
import axios from 'axios'

// ** Types Imports
import type { GetMeAccessesResponse, GetMeAccessesProps, IAccess } from 'src/types/dashboard/accessTypes'

export const getMeAccesses = async (params: GetMeAccessesProps): Promise<IAccess[]> => {
  const { data } = await axios<GetMeAccessesResponse>({
    method: 'GET',
    url: '/api/accesses/me',
    params: params
  })

  return data.data
}
