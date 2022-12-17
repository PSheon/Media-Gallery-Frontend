import { DEFAULT_DIALOG_BOX_PAYLOAD } from 'src/configs/verse/dialogBox'

import { IHoverObject } from 'src/views/verse/book/actions/edit'

export const generateEditDialogBoxPayload = ({ hoverObjectType = 'asset', hoverObjectMetadata }: IHoverObject) => {
  if (hoverObjectType === 'asset') {
    return {
      hoverObjectType: 'asset',
      hoverObjectMetadata
    }
  }

  return DEFAULT_DIALOG_BOX_PAYLOAD
}
