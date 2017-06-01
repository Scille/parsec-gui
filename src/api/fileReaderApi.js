import NotifyApi from './notifyApi'

class FileReaderApi {
  static read(fileR) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(fileR)
      reader.onerror = (evt) => reject({label: `Cannot read file '${fileR.name}'`})
      reader.onload = () => resolve(reader.result.split(',')[1])
    })
  }
}

export default FileReaderApi
