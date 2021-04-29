const express=require('express')
const Router=express.Router()
const {User}=require('../database')

Router.post('/create',async(req,res)=>{
      try{
            let user=new User(req.body)
            await user.save()
            res.status(201).send(user)
      }
      catch(error){
            res.status(500).send(error)
      }
})

module.exports=Router