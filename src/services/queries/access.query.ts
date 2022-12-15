// ** Utils Imports
import { useQuery } from '@tanstack/react-query'

// ** Services Imports
import { getMeAccesses } from 'src/services/api/access.service'

// ** Types Imports
import type { GetMeAccessesProps, GetAccessesResponse } from 'src/types/accessTypes'

export const useMeAccessesQuery = (params: GetMeAccessesProps) =>
  useQuery<GetAccessesResponse>(['accesses', 'me', { params }], () => getMeAccesses(params))
