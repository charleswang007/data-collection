function myFunction() {
    var feedUrl = "https://wishlist-api.takuros.net/prod?wishlist_id=2D8OEZMWRUYQ8";
    var xml = UrlFetchApp.fetch(feedUrl).getContentText();
    var document = XmlService.parse(xml);
    var root = document.getRootElement();
    var items = root.getChild('channel').getChildren('item');

    for (var i = 0; i < items.length; i++) {
        var title = items[i].getChild('title').getText();
        var link = items[i].getChild('link').getText();
        Logger.log(title);
        Logger.log(link);
    }
}