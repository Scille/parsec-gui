export const bytesToSize = (bytes=0) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '---';
  if (bytes === 1) return '1 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
}

export const dateToUTC = (date) => {
  return new Date(date.toFixed(0) * 1000).toUTCString()
}
