import { createStore } from "redux";
import reducers from "./reducers";
// import { setXlsxPassword, setXlsxFileLocation } from './actions'

let store = createStore(reducers);

// 記錄初始 state
// console.log(store.getState())

// 每次 state 變更，就記錄它
// 記得 subscribe() 會回傳一個用來撤銷 listener 的 function
// let unsubscribe = store.subscribe(() => {
//   console.log(store.getState())
// })

// Dispatch 一些 action
// store.dispatch(setXlsxPassword('thisIsPassword'));
// store.dispatch(setXlsxFileLocation('thisIsFileLocation'));
// 停止監聽 state 的更新
// unsubscribe()

export default store;