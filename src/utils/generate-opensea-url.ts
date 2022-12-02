export const generateOpenseaUrl = (
  chainId: string,
  newNftDetail: {
    token_address: string
    token_id: string
  }
) => {
  let network = 'ethereum'
  switch (chainId) {
    case '0x89':
    case '0x13881':
      network = 'matic'
      break

    default:
      break
  }

  return `https://opensea.io/assets/${network}/${newNftDetail.token_address}/${newNftDetail.token_id}`
}
