'use strict'
var express = require('express')
var app = new express()
app.get('/index.html',function(req,res){
	console.log(req.url);
	res.sendFile('index.html', {root: __dirname })
})

app.get('/searchMap.js',function(req,res){
console.log(req.url);
	res.sendFile('searchMap.js', {root: __dirname })
})

app.get('/Pollachi-1.csv',function(req,res){
console.log(req.url);
	res.sendFile('Pollachi-1.csv', {root: __dirname })
})

app.get('/*.jpg',function(req,res){
console.log(req.url);
	res.sendFile(req.url, {root: __dirname })
})

app.listen(1337,function(){
console.log('Server is Running on 1337')
})