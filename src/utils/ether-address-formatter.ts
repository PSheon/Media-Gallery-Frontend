export const etherAddressFormatter = (etherAddress: string): string => {
  const isEtherAddress = new RegExp(/^0x[a-fA-F0-9]{40}$/).test(etherAddress)

  if (isEtherAddress) {
    return `${etherAddress.substring(0, 12)}...`
  }

  return etherAddress
}
