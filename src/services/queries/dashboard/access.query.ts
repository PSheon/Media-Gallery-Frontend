// ** Utils Imports
import { useQuery } from '@tanstack/react-query'

// ** Services Imports
import { getMeAccesses } from 'src/services/api/dashboard/access.service'

// ** Types Imports
import type { IAccess, GetMeAccessesProps } from 'src/types/dashboard/accessTypes'

export const useMeAccessesQuery = (params: GetMeAccessesProps) =>
  useQuery<IAccess[]>(['accesses', 'me', { params }], () => getMeAccesses(params))
