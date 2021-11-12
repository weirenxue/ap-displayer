/*
 * action type
 */

export const SET_XLSX_PASSWORD = 'SET_XLSX_PASSWORD';
export const CLEAR_XLSX_PASSWORD = 'CLEAR_XLSX_PASSWORD';
export const SET_XLSX_FILE_LOCATION = 'SET_XLSX_FILE_LOCATION';
export const CLEAR_XLSX_FILE_LOCATION = 'CLEAR_XLSX_FILE_LOCATION';

export const SET_XLSX_ORIGINAL = 'SET_XLSX_ORIGINAL';
export const CLEAR_XLSX_ORIGINAL = 'CLEAR_XLSX_ORIGINAL';
export const SET_XLSX_FROM_SELECT_FILTER = 'SET_XLSX_FROM_SELECT_FILTER';
export const CLEAR_XLSX_FROM_SELECT_FILTER = 'CLEAR_XLSX_FROM_SELECT_FILTER';
export const SET_XLSX_FROM_FILTER = 'SET_XLSX_FROM_FILTER';
export const CLEAR_XLSX_FROM_FILTER = 'CLEAR_XLSX_FROM_FILTER';

/*
 * 其他常數
 */

/*
 * action creator
 */

export function setXlsxPassword(password) {
  return { type: SET_XLSX_PASSWORD, password }
}

export function clearXlsxPassword() {
  return { type: CLEAR_XLSX_PASSWORD }
}

export function setXlsxFileLocation(location) {
  return { type: SET_XLSX_FILE_LOCATION, location }
}

export function clearXlsxFileLocation() {
  return { type: CLEAR_XLSX_FILE_LOCATION }
}

export function setXlsxOriginal(origin) {
  return { type: SET_XLSX_ORIGINAL, origin }
}

export function clearXlsxOriginal() {
  return { type: CLEAR_XLSX_ORIGINAL }
}

export function setXlsxFromSelectFilter(fromSelectFilter) {
  return { type: SET_XLSX_FROM_SELECT_FILTER, fromSelectFilter }
}

export function clearXlsxFromSelectFilter() {
  return { type: CLEAR_XLSX_FROM_SELECT_FILTER }
}

export function setXlsxFromFilter(fromFilter) {
  return { type: SET_XLSX_FROM_FILTER, fromFilter }
}

export function clearXlsxFromFilter() {
  return { type: CLEAR_XLSX_FROM_FILTER }
}