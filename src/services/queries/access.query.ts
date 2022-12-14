// ** Utils Imports
import { useQuery } from '@tanstack/react-query'

// ** Services Imports
import { getMeAccesses } from 'src/services/api/access.service'

// ** Types Imports
import type { IAccess, GetMeAccessesProps } from 'src/types/accessTypes'

export const useMeAccessesQuery = (params: GetMeAccessesProps) =>
  useQuery<IAccess[]>(['accesses', 'me', { params }], () => getMeAccesses(params))
