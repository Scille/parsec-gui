import FileReaderApi from './fileReaderApi'

describe('FileReader API', () => {
  it('read file successful, resolve the Promise and return file content', () => {
    const fileR = new File(['test'], 'file.txt', { type: 'application/javascript', lastModified: new Date() })
    return FileReaderApi.read(fileR).then((data) => expect(data).toEqual('dGVzdA=='))
  })
  it('read file failure, reject the Promise', () => {
    const fileR = {}
    return FileReaderApi.read(fileR).catch((error) => expect(error).toBeTruthy())
  })
})
