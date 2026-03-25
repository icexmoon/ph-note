const KEY = 'drug_ph_records'

function getList() {
  try {
    const data = uni.getStorageSync(KEY)
    return Array.isArray(data) ? JSON.parse(JSON.stringify(data)) : []
  } catch (e) {
    return []
  }
}

function saveList(list) {
  uni.setStorageSync(KEY, list)
}

export function saveRecord(record) {
  const list = getList()
  list.unshift({ ...record })
  saveList(list)
}

export function updateRecord(newRecord, index) {
  const list = getList()
  list[index] = { ...newRecord }
  saveList(list)
}

export function deleteRecord(index) {
  const list = getList()
  list.splice(index, 1)
  saveList(list)
}

export function getRecordList() {
  return getList()
}