function myFunction() {  
  var feed_url = "https://wishlist-api.takuros.net/prod?wishlist_id=3G4653SB32HMZ";　//可替換成其他的wishlist_id
  var content = UrlFetchApp.fetch(feed_url).getContentText();
  var xml = XmlService.parse(content);
  var root = xml.getRootElement();
  var items = root.getChild('channel').getChildren('item');

  for (var i = 0; i < items.length; i++) {
    var title = items[i].getChild('title').getText();
    var link = items[i].getChild('link').getText();
    var result = getItem(link);
    Logger.log(title);
    Logger.log(link);
    if (result != null) {
      Logger.log(result['point']);
      Logger.log(result['discount']);
    }
  }
}

function getItem(url) {
  Logger.log("getItem");
  var result = {};
  var postheader = {
    "useragent":"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:15.0) Gecko/20120427 Firefox/15.0a1",
    "timeout":"50000"
  }

  var parameters = {
    "method":"get",
    "muteHttpExceptions": true,
    "headers": postheader
  }

  //  使用自訂的參數連接網頁
  var content = UrlFetchApp.fetch(url, parameters).getContentText();
  content = content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,''); //去除HTML標籤
  content = content.replace(/\n/g,"");  //去除換行字元
  //使用正規表達式擷取資料
  var point = content.match(/([\d]+pt[\s]+[\(|（][\d]+%[\)|）])/gi);
  var discount = content.match(/[\d]+の割引 [\(|（][\d]+%[\)|）]/gi);

  if (point) {
    result['point'] = point[0].replace(/\s/g,"");
  }
  if (discount) {
    result['discount']= discount[0].replace(/\s/g,"");
  }

  return result;
}
