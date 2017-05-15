import bytesToSize from './common'

describe('bytesToSize Functions', () => {
  const bytesToSizeList = [
    {bytes: undefined, size: '---'},
    {bytes: 0, size: '---'},
    {bytes: 1, size: '1 Byte'},
    {bytes: 512, size: '512 Bytes'},
    {bytes: 1023, size: '1023 Bytes'},
    {bytes: 1024, size: '1.0 KB'},
    {bytes: 1048473, size: '1023.9 KB'},
    {bytes: 1048576, size: '1.0 MB'},
    {bytes: 1073636966, size: '1023.9 MB'},
    {bytes: 1073741824, size: '1.0 GB'},
    {bytes: 1099404253593, size: '1023.9 GB'},
    {bytes: 1099511627776, size: '1.0 TB'},
    {bytes: 562949953421312, size: '512.0 TB'}
  ]

  it('converting file size in bytes to human readable', () => {
    for (let elt of bytesToSizeList) {
      expect(bytesToSize(elt.bytes)).toEqual(elt.size)
    }
  })
})
