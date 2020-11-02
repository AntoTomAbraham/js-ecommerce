var express = require('express');
const producthelpers = require('../helpers/producthelpers');
var router = express.Router();
var producthelper=require('../helpers/producthelpers')
/* GET users listing. */
router.get('/', function(req, res, next) {
  producthelper.getAllProducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products});
  })
});
router.get('/add-product',function(req,res){
  res.render('admin/add-products')
})
router.post('/add-product',(req,res)=>{
  console.log(req.body);
  console.log(req.files);
  producthelper.addProduct(req.body,(id)=>{
    let image=req.files.Image
    console.log(id)
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render("admin/add-products")
      }
    })
  })
})
router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  producthelper.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
})
router.get('/edit-product/:id',async (req,res)=>{
  let product=await producthelper.getProductDetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id',(req,res)=>{
  producthelper.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/')
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/product-images/'+req.params.id+'.jpg')
    }
  })
})
module.exports = router;