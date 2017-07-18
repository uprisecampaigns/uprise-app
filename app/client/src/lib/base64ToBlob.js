
export default function base64ToBlob(data) {
  const u = data.split(',')[1];
  const binary = atob(u);
  const array = [];

  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }

  const typedArray = new Uint8Array(array);

  return typedArray.buffer;
}

