function myFunction() {
    var formattedDate = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");

    // 1. 藉由URL開啟試算表
    var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/xxxxxxxxxxxxxxxxxxxxxx/edit');
    var sheet1=ss.getSheetByName("工作表1");
    sheet1.getRange(1,1).setValue("執行時間");     // 重置項目名稱
    sheet1.getRange(1,2).setValue(formattedDate);  // 重置時間
}