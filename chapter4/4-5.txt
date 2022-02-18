function myFunction() {
    // 1.取得HTML
    var url = "https://extraction.import.io/query/extractor/45159ebc-3749-49d2-a561-9d ...";  //省略
    var response = UrlFetchApp.fetch(url);
    var responseData = response.getContentText("UTF-8");

    // 2. 將取得資料轉換成JSON
    var json = JSON.parse(responseData);
    var data = json["extractorData"]["data"];

    // 在LOG中顯示名稱
    Logger.log(data[0]["group"][0]["Name"][0]["text"]); 

    // 在LOG顯示昨日收盤價
    Logger.log(data[0]["group"][0]["PreviousClose"][0]["text"]); 
}
