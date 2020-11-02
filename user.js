const { response } = require('express');
var express = require('express');
var router = express.Router();
var producthelper=require('../helpers/producthelpers')
const userHelper=require('../helpers/userhelpers')
/* GET home page. */
const verifyLogin=(req,res,next)=>{
  if(req.session.logedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
router.get('/',async function(req, res, next) {
  let user=req.session.user
  console.log(user);
  let cartCount=null
  if(req.session.user){
    cartCount=await userHelper.getCartCount(req.session.user._id)
  }
  producthelper.getAllProducts().then((products)=>{
  res.render('user/index', {products,cartCount, user,admin:false});
  })
});

router.post('/signup',(req,res)=>{
  userHelper.doSignup(req.body).then((response)=>{
    console.log(response)
    req.session.logedIn=true
    req.session.user=response
    res.redirect('/')
  })
  res.render('user/signup');
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.logedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.loginErr="Invalid Username and Password"
      res.redirect('/login')
    }
  })
})
router.get('/login',(req,res)=>{
  if(req.session.logedIn){
    res.redirect('/')
  }else
  res.render('user/login',{"loginErr":req.session.loginErr});
  req.session.loginErr=false
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart',verifyLogin,async (req,res)=>{
  let products=await userHelper.getCartProducts(req.session.user._id)
  console.log(products)
  res.render('user/cart',{products,user:req.session.user})
})
router.get('/add-to-cart/:id',(req,res)=>{
  console.log("api call")
  userHelper.addToCart(req.params.id,req.session.user._id).then(()=>{
   // res.redirect('/')
   res.json({status:true})
  })
})
module.exports = router;
