'use strict'

var express = require('express')
var log = require('log4js')
var app = new express()
var path = require('path')
var logger = log.getLogger(app)
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

app.listen(1337,function(){
logger.info('Server is Running on 1337')
})