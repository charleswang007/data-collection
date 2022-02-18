'use strict';

/**
 * 從公開的AMAZON心願清單取得商品ASIN
 *
 */


var client = require('cheerio-httpcli');
var DOMParser = require('xmldom').DOMParser;
var xml_str;

const base = 'http://www.amazon.co.jp';

exports.handler = (event, context, callback) => {
  console.log("handler_start");
  var wishlist_id = event.wishlist_id;
  console.log(wishlist_id);
  if (wishlist_id == null) {
    callback(null,null);
  }
  var url = base+"/gp/registry/wishlist/"+wishlist_id;
  var wishlist = "WishList";
  
  xml_str =
    "<?xml version='1.0' encoding='UTF-8'?>\n"+
    "<rss version='2.0'>\n"+
    "  <channel>\n";
  xml_str += "    <title>"+entityify(wishlist)+"</title>\n";
  xml_str += "    <link>"+entityify(url)+"</link>\n";
  xml_str += "    <description></description>\n";
  getWishList(url,callback);
  console.log("handler_end");
}

function getWishList(url,callback) {
  console.log("getWishList");
  client.fetch(url, function (err, $, res, body) {
    
    $("div .a-fixed-right-grid").each(function () {
      var wish = {};
       
      var element = $(this).find("h5 .a-link-normal");
      var href = element.attr('href');
      var title = element.attr('title');
      if (href) {
        var array = href.match(/(\/dp\/+)(.{10})/);
        var asin = array[2];
      
        var date_added = $(this).find("span[class='a-size-small']").text();
        if (date_added != null & date_added.length > 0) { 
          date_added= parseDate(date_added);
        }
        wish.title = title;
        wish.link = href+"&tag=wishli-22";
        wish.description = "";
        wish.pubDate = date_added;
        xml_str += "    <item>\n";
        xml_str += "      <title>"+entityify(wish.title)+"</title>\n";
        xml_str += "      <link>https://www.amazon.co.jp"+entityify(wish.link)+"</link>\n";
        xml_str += "      <description>"+wish.description+"</description>\n";
        xml_str += "      <pubDate>"+wish.pubDate+"</pubDate>\n";
        xml_str += "    </item>\n";
      }
    });

    var next = hasNextPage($);
    if (next) {
      console.log("next");
      getWishList(base+next, callback);
      //getWishList(base+next);
    } else {
      console.log("end");
      xml_str += "  </channel>\n";
      xml_str += "</rss>\n";
      callback(null, xml_str);
      //return xml_str;
    }
  });
};

function hasNextPage($){
  console.log("hasNextPage");
  //return $('div[id=wishlistPagination] .a-last a').attr('href');
};

function parseDate(str) {
  var s = str.match(/(\d+)/g);
  var year = s[0];
  var month =  (("00") + s[1]).substr(-2);
  var day =  (("00") + s[2]).substr(-2);
  var result = new Date(Date.UTC(year, month-1, day, 0, 0, 0, 0));;
  return result;
}

var entityify = (function(){

    var character = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        '\'': '&#39;'
    };

    return function(t) {
        return t.replace(/[<>'&"]/g, function(c) {
            return character[c];
        });
    };

})();

