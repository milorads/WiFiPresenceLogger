var fs = require('fs');
var crypto = require('crypto');

function checkCode(hashCode,timestamp)
{
	const devCode = "bfa86fdd-398c-462e-9b4e-9cb52ffafb58";
	var today = new Date();
	var tStamp = new Date(timestamp);
	if(today - tStamp > 10)
		return 2; //timeout
	else
	{
		code = devCode + timestamp;
		var localHashCode = crypto.createHash('md5').update(code).digest('hex');
		if(code == String(localHashString))
		{
			return 1; //right hash
		}
		else
		{
			return 0; //wrong hash
		}
	}
	
}
api.get('/getData',function(req,res){
	
});
api.get('/deleteData',function(req,res){
	
});
api.get('/apiTest',function(req,res){
	var type = req.query.type
	var code = req.query.code
	if(checkCode(code))
	{
		
	}
	else
	{
		console.log("code=" + code);
	}
});
api.get('/listData',function(req,res){
	
});
app.listen(3002);