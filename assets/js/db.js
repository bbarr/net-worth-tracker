
import { del, get, set } from 'https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js';

let data = {}

async function getDataFromFileHandle(fileHandle) {
  const file = await fileHandle.getFile();
  const content = await file.text();
  try {
    return JSON.parse(content || '{}')
  } catch(e) {
    return alert('Malformed balance data. Please contact brendan@8020money.app for support.')
  }
}

export async function createFile() {
  const options = {
    types: [
      {
        description: 'JSON File',
        accept: {
          'text/plain': ['.json'],
        },
      },
    ],
  };
  const handle = await window.showSaveFilePicker(options);
  await set('data-file-handle', handle)
  await writeToDisk(existing => {
    return {
      assets: [],
      liabilities: [],
      valuations: [],
      links: []
    }
  })
}

export async function getFileHandleFromCache() {
  return get('data-file-handle');
}

export async function getDataFromFileSystem() {
  const [ fileHandle ] = await window.showOpenFilePicker();
  await set('data-file-handle', fileHandle)
  return getDataFromFileHandle(fileHandle)
}

export async function getDataFromCache() {
  let fileHandle = await get('data-file-handle');
  return getDataFromFileHandle(fileHandle)
}

export async function getDataFromAnywhere() {
  return (await getDataFromCache()) || getDataFromFileSystem()
}

export async function clearCache() {
  return del('data-file-handle')
}

export async function writeToDisk(cb) {
  const fileHandle = await getFileHandleFromCache()
  const writable = await fileHandle.createWritable();

  const existingData = await getDataFromCache()

  const newData = cb(existingData)
  await writable.write(JSON.stringify(newData, null, 4))
  await writable.close();
}
