function myFunction() {
  /// 定義每頁的評論數目
  const PAGE_REVIEW_NUM = 10;

  // 1.取得HTML
  var baseUrl = "https://www.amazon.co.jp/product-reviews";

  var asin = "4797382570";
  // asin = "B00TO6KMEK";
  var pageNum = 1;
  var url = getUrl(baseUrl, asin, pageNum)
  Logger.log(url);

  var xml = getXml(url);

  // 4. 準備工作表
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet=ss.getSheetByName("review");
  var row=1;
  writeSpreadsheet(sheet, row, 1, '評價');
  writeSpreadsheet(sheet, row, 2, '評論日期');
  writeSpreadsheet(sheet, row, 3, '評論內容');
  row++;

  // 5. 取得評論總數
  var reviewCount = getReviewCount(xml);

  // 6. 依照評論頁數依序寫入資料
  var maxPage = parseInt(reviewCount / PAGE_REVIEW_NUM +1);
  Logger.log(parseInt(reviewCount / PAGE_REVIEW_NUM +1));
  for (var i=1 ; i<=maxPage ; i++){
    url = getUrl(baseUrl, asin, i);
    if( xml == null ){ xml = getXml(url); }
    var reviewArray = getReview(xml);
    Logger.log("array");
    Logger.log(reviewArray[0]['rate']);
    for (var key in reviewArray) {
      writeSpreadsheet(sheet, row, 1, reviewArray[key]['rate']);
      writeSpreadsheet(sheet, row, 2, reviewArray[key]['review_date']);
      writeSpreadsheet(sheet, row, 3, reviewArray[key]['review_body']);
      row++;      
    }
    xml = null;
  }
}

function getUrl(baseUrl, asin, pageNum) {
  return baseUrl + "/" + asin + "/ref=cm_cr_getr_d_show_all?pageNumber=" + pageNum;
}   

function getXml(url) {
  Logger.log("getXml");
  try{
    var content = getContent(url);
    var xml = parseXmlObject(content);
  }catch(e){
    Logger.log("error");
    Logger.log(e);
    Utilities.sleep(5000);
    getXml(url);
  }
  return xml;
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

  // 3.  使用自訂的參數連接網頁
  var content = UrlFetchApp.fetch(url, parameters).getContentText();
  if (isAmazonCaptcha(content)) {
    //Amazon Captcha網頁出現的話、Sleep十秒後再次連接
    Logger.log("Amazon CAPTCHA")
    Utilities.sleep(10000);
    content = getContent(url);
  }
  return content;
}
  
function parseXmlObject(content) {
  Logger.log("getXmlObject");
  // 4. 轉換成XML物件
  var doc = Xml.parse(content, true);
  var bodyHtml = doc.html.body.toXmlString();
  doc = XmlService.parse(bodyHtml);
  var rootXml = doc.getRootElement();

  return rootXml;
}

function getReviewCount(xml) {
  Logger.log("getReviewCount");
  Logger.log(xml);
  return getElementByAttribute(xml, 'data-hook', 'total-review-count').getValue();
}

function getReview(xml) {
//5. 取得客戶評論List
  var reviewList = getElementsByClassName(xml, 'a-section review');
  //var row = 2;
  var array = [];
  for each(var review in reviewList) {
    //6. 擷取各個客戶評論中的資料並儲存至物件中
    var obj = {};
    obj.rate = getElementByAttribute(review, 'data-hook', 'review-star-rating' ).getValue(); //評分（rate）
    obj.review_date = getElementByAttribute(review, 'data-hook', 'review-date' ).getValue(); //評論日期
    obj.review_body = getElementByAttribute(review, 'data-hook', 'review-body' ).getValue(); //評論內容
    array.push(obj);
  }
  return array;
}


function writeSpreadsheet(sheet, row, column, value) {
  sheet.getRange(row, column).setValue(value);
}

function getElementByAttribute(element, attributeToFind, valueToFind) {
  Logger.log("getElementByAttribute");
  var descendants = element.getDescendants();
  for (var i in descendants) {
    var elem = descendants[i].asElement();
    if ( elem != null) {
      var e = elem.getAttribute(attributeToFind);
      if ( e != null && e.getValue() == valueToFind) return elem;
    }
  }
}

function getElementsByClassName(element, classToFind) {
  Logger.log("getElementsByClassName");
  var data = [], descendants = element.getDescendants();
  descendants.push(element);
  for (var i in descendants) {
    var elem = descendants[i].asElement();
    if (elem != null) {
      var classes = elem.getAttribute('class');
      if (classes != null) {
        classes = classes.getValue();
        if (classes == classToFind) {
          data.push(elem);
        } else {
          classes = classes.split(' ');
          for (var j in classes) {
            if (classes[j] == classToFind) {
              data.push(elem);
              break;
            }
          }
        }
      }
    }
  }
  return data;
}

function getElementById(element, idToFind) {
  Logger.log("getElementById");
  var descendants = element.getDescendants();
  for (var i in descendants) {
    var elem = descendants[i].asElement();
    if ( elem != null) {
      var id = elem.getAttribute('id');
      if ( id != null && id.getValue() == idToFind) return elem;
    }
  }
}


function getElementsByTagName(element, tagName) {
  Logger.log("getElementsByTagName");
  var data = [], descendants = element.getDescendants();
  for(var i in descendants) {
    var elem = descendants[i].asElement();
    if ( elem != null && elem.getName() == tagName) data.push(elem);
  }
  return data;
}

function isAmazonCaptcha(content) {
  if (content.match(/Amazon CAPTCHA/)) {
      return true;
  }
  return false;
}