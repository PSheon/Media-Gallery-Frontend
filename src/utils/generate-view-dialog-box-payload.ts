import { DEFAULT_DIALOG_BOX_PAYLOAD } from 'src/configs/verse/dialogBox'

import { IHoverObject } from 'src/views/verse/book/actions/view'

export const generateViewDialogBoxPayload = ({ hoverObjectType = 'asset', hoverObjectMetadata }: IHoverObject) => {
  /* TODO */
  // if (objectType === 'player') {
  //   return {
  //     speaker: displayName,
  //     session: [
  //       {
  //         type: 'playerInfo',
  //         playerDisplayName: displayName
  //       }
  //     ]
  //   }
  // }
  // if (objectType === 'artwork') {
  //   return {
  //     speaker: displayName,
  //     session: [
  //       {
  //         type: 'artworkInfo',
  //         nftFrameId: displayName
  //       }
  //     ]
  //   }
  // }
  // if (objectType === 'npc') {
  //   const NPC_SESSION_TABLE: Record<string, any> = {
  //     Shark_Bob: {
  //       speaker: 'Bob',
  //       session: [
  //         {
  //           type: 'dialog',
  //           speaker: 'Bob',
  //           content: `Hi's How are you today?`
  //         },
  //         {
  //           type: 'dialog',
  //           speaker: 'Bob',
  //           content: `Be careful`
  //         },
  //         {
  //           type: 'dialog',
  //           speaker: 'Bob',
  //           content: `If you dive too deep. You will fall to the other dimension.`
  //         }
  //         // {
  //         //   type: 'redirect',
  //         //   speaker: 'Bob',
  //         //   content: `Do you want to go Gallery?`,
  //         //   destination: 'gallery'
  //         // }
  //       ]
  //     },
  //     Shark_Ken: {
  //       speaker: 'Ken',
  //       session: [
  //         {
  //           type: 'dialog',
  //           speaker: 'Ken',
  //           content: `Hi I'm Ken`
  //         },
  //         {
  //           type: 'dialog',
  //           speaker: 'Ken',
  //           content: `Enjoy`
  //         }
  //       ]
  //     },
  //     Shark_Ian: {
  //       speaker: 'Ian',
  //       session: [
  //         {
  //           type: 'dialog',
  //           speaker: 'Ian',
  //           content: `Hi I'm Ian`
  //         },
  //         {
  //           type: 'dialog',
  //           speaker: 'Ian',
  //           content: `Have you seen my bear Tibbers?`
  //         }
  //       ]
  //     },
  //     Shark_Jack: {
  //       speaker: 'Jack',
  //       session: [
  //         {
  //           type: 'dialog',
  //           speaker: 'Jack',
  //           content: `I came`
  //         },
  //         {
  //           type: 'dialog',
  //           speaker: 'Jack',
  //           content: `I see`
  //         },
  //         {
  //           type: 'dialog',
  //           speaker: 'Jack',
  //           content: `I conquer`
  //         }
  //       ]
  //     },
  //     Shark_Neo: {
  //       speaker: 'Neo',
  //       session: [
  //         {
  //           type: 'dialog',
  //           speaker: 'Neo',
  //           content: `I'm the one`
  //         },
  //         {
  //           type: 'dialog',
  //           speaker: 'Neo',
  //           content: `remember pick the blue one`
  //         },
  //         {
  //           type: 'dialog',
  //           speaker: 'Neo',
  //           content: `That's all`
  //         }
  //       ]
  //     }
  //   }
  //   return NPC_SESSION_TABLE[displayName]
  // }
  // return DEFAULT_DIALOG_BOX_PAYLOAD

  console.log('hoverObjectType, ', hoverObjectType)
  if (hoverObjectType === 'npc') {
    return {
      hoverObjectType: 'npc',
      hoverObjectMetadata
    }
  }

  if (hoverObjectType === 'asset') {
    return {
      hoverObjectType: 'asset',
      hoverObjectMetadata
    }
  }

  return DEFAULT_DIALOG_BOX_PAYLOAD
}
