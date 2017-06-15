import {
  bytesToSize,
  dateToUTC,
  saveAs,
  getPath
} from '.'

describe('Common Functions', () => {
  describe('bytesToSize', () => {
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
      for(let elt of bytesToSizeList) {
        expect(bytesToSize(elt.bytes)).toEqual(elt.size)
      }
    })
  })

  describe('dateToUTC', () => {
    it('converting unix timestamp to human readable date', () => {
      expect(dateToUTC(1483228800)).toEqual('Sun, 01 Jan 2017 00:00:00 GMT')
    })

    it('converting string date to human readable date', () => {
      expect(dateToUTC('2017-01-01T00:00:00+00:00')).toEqual('Sun, 01 Jan 2017 00:00:00 GMT')
    })
  })

  describe('getPath', () => {
    it('generate file path', () => {
      expect(getPath('/', 'file.txt')).toEqual('/file.txt')
      expect(getPath('/files', 'file.txt')).toEqual('/files/file.txt')
    })
  })
})
