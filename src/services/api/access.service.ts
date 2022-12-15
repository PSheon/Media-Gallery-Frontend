// ** Utils Imports
import axios from 'axios'

// ** Types Imports
import type { GetAccessesResponse, GetMeAccessesProps } from 'src/types/accessTypes'

export const getMeAccesses = async (params: GetMeAccessesProps): Promise<GetAccessesResponse> => {
  const { data } = await axios<GetAccessesResponse>({
    method: 'GET',
    url: '/api/accesses/me',
    params: params
  })

  return data
}
