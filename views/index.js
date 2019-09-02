const express = require('express')
const server = express()
const qr = require('qr-image')
const OAuth = require('wechat-oauth')

server.get('/home', function (request, response) {
    console.log(request.query.page)
    response.send('get参数请求成功')
})

//Parsing URL
function UrlSearch(url){
   var num=url.indexOf("?")
   url=url.substr(num+1)
   let obj = {}
   var arr=url.split("&")
   for(var i=0;i < arr.length;i++){
        num=arr[i].indexOf("=")
        if(num>0){
            obj[arr[i].substring(0,num)] = arr[i].substr(num+1)
        }
    }
    return obj
} 

server.get('/get_img',function(request, response){
    const client = new OAuth('wx94864d8a37bde769', 'd6b1fa96c1c0b2f931aa5edfdec4d793')
    const redirectUrl = 'http://192.168.1.100:4040/get_open_id'
    //const uuidv1 = require('uuid/v1');
    const url = client.getAuthorizeURL(redirectUrl, '123123123', 'snsapi_userinfo')

    const qrSvg = qr.image(url, { type: 'png', ec_level: 'H' })
    response.setHeader('Content-type', 'image/png');  //sent qr image to client side
    qrSvg.pipe(response);
})

server.get('/get_open_id',function(request, response){
    const code = UrlSearch(request.url).code
    const client = new OAuth('wx94864d8a37bde769', 'd6b1fa96c1c0b2f931aa5edfdec4d793')
    client.getAccessToken(code, function (err, result) {
        var accessToken = result.data.access_token;
        var openid = result.data.openid;
        client.getUser(openid, function (err, result2) {
            var userInfo = result2
            console.log('userInfo',userInfo)
        })
    })
    response.send(code)
})
server.listen(4040)