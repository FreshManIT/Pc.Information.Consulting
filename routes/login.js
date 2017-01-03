var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res,next) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.route("/login").get(function(req,res){
	res.render("login",{title:'用户登录'});
}).post(function(req,res){// get post for login.
	var uname = req.body.uname;//get post uname data.
	var password=req.body.upwd;//get post password data
	if(uname=='admin' && password=='freshman'){
		//TODO data check.
		var user={userName:uname,password:password};
		res.cookie('userInfo', user, {maxAge: 60 * 1000});
		res.redirect('/home');
	}
	else{
		req.session.error = "用户名或密码错误";
		res.send(404);
	}
});

/* GET register page. */
router.route("/register").get(function(req,res){// 到达此路径则渲染register文件，并传出title值供 register.html使用
	res.render("register",{title:'User register'});
}).post(function(req,res){ 
	 //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
	var User = global.dbHandel.getModel('user');
	var uname = req.body.uname;
	var upwd = req.body.upwd;
	User.findOne({name: uname},function(err,doc){// 同理 /login 路径的处理方式
		if(err){ 
			res.send(500);
			req.session.error =  '网络异常错误！';
			console.log(err);
		}else if(doc){ 
			req.session.error = '用户名已存在！';
			res.send(500);
		}else{ 
			User.create({// 创建一组user对象置入model
				name: uname,
				password: upwd
			},function(err,doc){ 
				 if (err) {
                        res.send(500);
                        console.log(err);
                    } else {
                        req.session.error = '用户名创建成功！';
                        res.send(200);
                    }
                  });
		}
	});
});

/* GET home page. */
router.get("/home",function(req,res){ 
	if(!req.cookies.userInfo){//到达/home路径首先判断是否已经登录
		req.session.error = "请先登录"
		res.redirect("/login");//未登录则重定向到 /login 路径
		return;
	}
	res.render("home",{title:'首页-FreshMan'});//已登录则渲染home页面
});

/* GET logout page. */
router.get("/logout",function(req,res){// 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
	req.cookies.userInfo=null;
	req.session.user = null;
	req.session.error = null;
	res.redirect("/");
});

module.exports = router;
