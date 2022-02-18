function myFunction() {
  var code = "4689";
  var baseUrl = "http://info.finance.yahoo.co.jp/history/?code=" + code + ".T&sy=1900&sm=1&sd=1&ey=2020&em=5&ed=27&tm=d" //&p=1
  var pageNum = 1;
  var url = getUrl(baseUrl, pageNum);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet=ss.getSheetByName("股價");
  var row=1;
  writeSpreadsheet(sheet, row, 1, '日期');
  writeSpreadsheet(sheet, row, 2, '開盤價');
  writeSpreadsheet(sheet, row, 3, '盤中最高價');
  writeSpreadsheet(sheet, row, 4, '盤中最低價');
  writeSpreadsheet(sheet, row, 5, '收盤價');
  writeSpreadsheet(sheet, row, 6, '成交量');
  writeSpreadsheet(sheet, row, 7, '調整後收盤價');

  row++;
  do {
    Logger.log(url);
    var content = getContent(url);
    var result = getDailyData(content);
    for (var key in result){
      // 5. 寫入工作表
      //writeSpreadsheet(sheet, row, 1, data['rate']);
      Logger.log(result[key]['date']);
      writeSpreadsheet(sheet, row, 1, result[key]['date']);
      writeSpreadsheet(sheet, row, 2, result[key]['open']);
      writeSpreadsheet(sheet, row, 3, result[key]['high']);
      writeSpreadsheet(sheet, row, 4, result[key]['low']);
      writeSpreadsheet(sheet, row, 5, result[key]['close']);
      writeSpreadsheet(sheet, row, 6, result[key]['volume']);
      writeSpreadsheet(sheet, row, 7, result[key]['adj_close']);
      row++;
    }

    pageNum ++;
    url = getUrl(baseUrl, pageNum);
  } while (hasNextPage(content));
}

function getDailyData(content) {
  Logger.log("getDailyData");
  //擷取table內部的字串
  var fromText = '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="boardFin yjSt marB6">';
  var toText = "</table>";
  var extract_content = Parser
                    .data(content)
                    .from(fromText)
                    .to(toText)
                    .build();

  var result = [];
  var tr_array = extract_content.split("</tr>");
  //跳過標題，從第二行開始執行
  for (var i = 1; i < tr_array.length; i++) {
    var td_array = tr_array[i].match(/<td>([^<]*)<\/td>/gi);
    var datas = {};
    if  (td_array != null && td_array.length == 7) {
      datas.date = td_array[0].replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'')
      datas.open = td_array[1].replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'')
      datas.high = td_array[2].replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'')
      datas.low = td_array[3].replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'')
      datas.close = td_array[4].replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'')
      datas.volume = td_array[5].replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'')
      datas.adj_close = td_array[6].replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'')
      result.push(datas);
    }
  }
  return result;
}

function hasNextPage(content) {
  var fromText = '<ul class="ymuiPagingBottom clearFix">';
  var toText = "</ul>";
  var extract_content = Parser
                    .data(content)
                    .from(fromText)
                    .to(toText)
                    .build();
  if (extract_content.match(/次へ<\/a>/)) 
    return true;
}

function getContent(url) {
  Logger.log("getContent");
  // 2. 建立header情報
  var postheader = {
    "useragent":"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:15.0) Gecko/20120427 Firefox/15.0a1",
    "timeout":"50000"
  }

  var parameters = {
    "method":"get",
    "muteHttpExceptions": true,
    "headers": postheader
  }

  // 使用自訂的參數連接網頁
  var content = UrlFetchApp.fetch(url, parameters).getContentText();
  return content;
}

function writeSpreadsheet(sheet, row, column, value) {
  sheet.getRange(row, column).setValue(value);
}

function getUrl(baseUrl, pageNum) {
  return baseUrl + "&p=" + pageNum;
}   
