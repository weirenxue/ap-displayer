import { 
  SET_XLSX_PASSWORD, 
  SET_XLSX_FILE_LOCATION, 
  SET_XLSX_ORIGINAL,
  SET_XLSX_FROM_SELECT_FILTER,
  SET_XLSX_FROM_FILTER,
  CLEAR_XLSX_PASSWORD,
  CLEAR_XLSX_FILE_LOCATION,
  CLEAR_XLSX_ORIGINAL,
  CLEAR_XLSX_FROM_SELECT_FILTER,
  CLEAR_XLSX_FROM_FILTER
} from './actions';
import { combineReducers } from 'redux'

const initState = {
  xlsxFileInfo: {
    password: '',
    location: '',
  },
  xlsxContent: {
    origin: {},
    fromSelectFilter: {},
    fromFilter: {},
  }
}

function xlsxFileInfo(state = initState.xlsxFileInfo, action) {
  switch(action.type) {
    case SET_XLSX_PASSWORD:
      return {
        ...state,
        password: action.password
      }
    case CLEAR_XLSX_PASSWORD:
      return {
        ...state,
        password: initState.xlsxFileInfo.password
      }
    case SET_XLSX_FILE_LOCATION:
      return {
        ...state,
        location: action.location
      }
    case CLEAR_XLSX_FILE_LOCATION:
      return {
        ...state,
        location: initState.xlsxFileInfo.location
      }
    default:
      return state;
  }
}

function xlsxContent(state = initState.xlsxContent, action) {
  switch(action.type) {
    case SET_XLSX_ORIGINAL:
      return {
        ...state,
        origin: action.origin
      };
    case CLEAR_XLSX_ORIGINAL:
      return {
        ...state,
        origin: initState.xlsxContent.origin
      };
    case SET_XLSX_FROM_SELECT_FILTER:
      return {
        ...state,
        fromSelectFilter: action.fromSelectFilter
      };
    case CLEAR_XLSX_FROM_SELECT_FILTER:
      return {
        ...state,
        fromSelectFilter: initState.xlsxContent.fromSelectFilter
      };
    case SET_XLSX_FROM_FILTER:
      return {
        ...state,
        fromFilter: action.fromFilter
      };
    case CLEAR_XLSX_FROM_FILTER:
      return {
        ...state,
        fromFilter: initState.xlsxContent.fromFilter
      };
    default:
      return state;
  }
}

export default combineReducers({
  xlsxFileInfo,
  xlsxContent
});