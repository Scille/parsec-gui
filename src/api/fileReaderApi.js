class FileReaderApi {
  static read(fileR) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.readAsDataURL(fileR)
    })
  }
}

export default FileReaderApi
