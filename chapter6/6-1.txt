function myFunction() {
　  // 1. 指定URL開啟試算表(請輸入Google Spreadsheet文件的實際URL)
    var url = "https://docs.google.com/spreadsheets/d/abc1234/edit";
    var spredSheet = SpreadsheetApp.openByUrl(url);

    // 2. 取得日期
    var d = new Date();
    var targetName = Utilities.formatDate( d, 'JST', 'yyyyMMdd');

    // 3. 開啟base工作表和目標工作表
    var baseSheet = spredSheet.getSheetByName("base");
    var targetSheet = createSheet(spredSheet, targetName, 0);

    // 4. 再次使用ImportFeed函數
    baseSheet.getRange(1,1).setValue("");
    baseSheet.getRange(1,2).setValue("");
    baseSheet.getRange(1,1).setFormula("IMPORTFEED(\"https://itunes.apple.com/tw/rss/toppaidapplications/limit=25/genre=6015/xml?x=" + targetName + "\",\"items title\",\"true\")");
    baseSheet.getRange(1,2).setFormula("IMPORTFEED(\"https://itunes.apple.com/tw/rss/toppaidapplications/limit=25/genre=6015/xml?x=" + targetName + "\",\"items url\",\"true\")");

    // 5. 複製取得值至目標工作表
    // 指定複製範圍（A2～B21）
    var rangeToCopy = baseSheet.getRange(2, 1, 20, 2);
    //指定複製目的地的起始儲存格（A1）
    var targetToCopy = targetSheet.getRange('A1');
    rangeToCopy.copyTo(targetToCopy);
}

function createSheet(spredSheet, sheetName, index) {
    var sheet = spredSheet.getSheetByName(sheetName);
    if ( sheet == null) {
        spredSheet.insertSheet(sheetName, index);
        sheet = spredSheet.getSheetByName(sheetName);
    }
    return sheet;
}
