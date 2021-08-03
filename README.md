[![made-with-nodejs](https://img.shields.io/badge/Made%20with-Node.js-1f425f.svg)](https://nodejs.org/en/)
[![node.js version](https://img.shields.io/badge/Node.js-14.16.1-blue)](https://nodejs.org/en/)
[![electron.js version](https://img.shields.io/badge/Electron.js-13.1.7-green)](https://www.electronjs.org/)
[![react.js version](https://img.shields.io/badge/React.js-17.0.2-green)](https://www.electronjs.org/)

## Account/Password Displayer

詳細介紹請參考 [[Tool] IT 的好幫手 - 帳密顯示器](https://weirenxue.github.io/2021/06/15/tool_it_ap_displayer/)。

### 為什麼要使用此專案？

我們可以將帳密表存在於 Excel (`*.xlsx`) 中，在透過此專案所開發之應用程式顯示，根據自己的喜好篩選資訊、遮罩資訊、隱藏資訊。  

使用此專案有幾個好處：  

1. `可以處理受加密的 xlsx 檔案 (當然需輸入正確密碼)`，這樣若 Excel 加密過就不用擔心外流。:sparkles::thumbsup::sunglasses:
1. 得益於使用 Excel 當作 DB，`不會有任何可能性將帳密存於別人的資料庫內`，非常安全。:clap:
1. `根據自己的喜好隱藏密碼或其他機敏資訊欄位`，他人在旁邊偷看時也只能看到帳號而不知密碼，比直接開啟 Excel 好多了！:clap:
1. 直接點擊按鈕執行動作，不同協定有不同效果。例如  
    1. 協定為 `rdp`：將`自動化開啟遠端軟體 (mstsc)`，自動輸入目標 URI，並帶著帳密登入，免去剪剪貼貼輸入 IP/AP 的繁雜程序。:clap:
    1. 協定為 `http`/`https`：網頁登入形式太多，因此不協助登入，將會`使用系統預設瀏覽器開啟該網址 (URI)`。另外可用滑鼠右鍵:computer_mouse:點擊應用程式中的表格，即可直接複製帳號與密碼，省去框選/複製的時間，直接於網頁登入欄位貼上資訊。:clap:
    1. 其他協定：目前尚未實作，歡迎一起將此專案做的更完善。
1. `使用下拉式選單` 或者 `關鍵字` 篩選出想要的資訊  
    1. 下拉式選單：`由使用者自己選定`甚麼欄位要用下拉式選單篩選，非常自由。:clap:
    1. 關鍵字：單筆資料中，只要有一個欄位包含關鍵字的就會被篩選出來，可用半形逗號 (,) 來輸入多個關鍵字！:clap:  
1. `右鍵點擊表格，便可複製表格中的資訊`，省去框選並複製的時間 (自己框選還有可能選錯、多選到空白鍵，有這個功能真是太好了 :sob:)。:clap:
1. 此專案只會呈現資訊，並不能修改內容，`不用怕修改到原始檔案`。:clap:
1. 備份 Excel 檔即可。:clap:

### 如何使用？

1. 下載 [tempalate.xlsx](https://firebasestorage.googleapis.com/v0/b/gh-pages-88339.appspot.com/o/Tool-IT-%E7%9A%84%E5%A5%BD%E5%B9%AB%E6%89%8B-%E5%B8%B3%E5%AF%86%E9%A1%AF%E7%A4%BA%E5%99%A8%2Ftemplate.xlsx?alt=media&token=7d97e0da-ac7b-40a9-b4b8-af8a80390ce5) 檔案並開啟，會看到有兩個工作表:page_facing_up::page_facing_up:，分別為 `metadata`、`ap`。

    - `metadata` 工作表  
        已經有定義好的一排標頭 (順序請勿更動)，根據定義增加紀錄即可。此工作表用來定義應用程式中顯示資料的相關設定。
        1. `apHeader`：在 `ap` 工作表中的欄位名稱。:heavy_check_mark:
        1. `displayHeader`：要顯示在應用程式的欄位名稱。:heavy_check_mark:
        1. `hide`：是否預設隱藏此欄位，可另於應用程式中設定隱藏或顯示，空值代表不隱藏。:heavy_check_mark:
        1. `mask`：是否預設遮罩此欄位，被遮罩的內容會以 `*` 符號表示，空值代表不遮罩。:heavy_check_mark:
        1. `filterPriority`：下拉式選單的欄位優先順序，優先權越高填寫越高的數值，若為非數值，會以 `-9999` 作為其優先權；若為空值表示不作為篩選欄位。:heavy_check_mark:
    - `ap` 工作表  
        根據在 `metadata` 工作表設定的欄位，於此處添加相對應欄位。有 4 個欄位必須要有 (也必須存在於 `metadata` 工作表) :bangbang:，如此一來對應的動作按鈕才能運作，分別為
        1. `protocol`：該系統對應的協定，目前 rdp/http/https 有對應的動作。
        1. `uri`：該系統對應的 uri。
        1. `account`：帳號。
        1. `password`：密碼。

1. 視需求加密 Excel 檔案。:lock:
1. 開啟 AP Displayer，選擇帳密檔案 (`*.xlsx`) 並輸入密碼 (若有的話，無密碼則為空即可)。:key:
1. 將會列出 Excel 內的帳密資訊！:100::trollface:
