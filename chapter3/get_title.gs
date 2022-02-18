function myFunction() {
    // 1.取得HTML
    var url = "http://www.wantgoo.com/stock/2330";
    var response = UrlFetchApp.fetch(url);
    var content = response.getContentText("UTF-8");

    // 2. 利用正規表達式擷取特定元素
    var title = content.match(/<title>(.*?)<\/title>/);

    // 3. 將取得的資料保存在試算表
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet1=ss.getSheetByName("工作表1");
    sheet1.getRange(1,1).setValue("網頁標題"); //設定項目名稱
    sheet1.getRange(1,2).setValue(title[1]); //標題
}
