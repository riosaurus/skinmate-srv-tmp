const { Router } = require('express');
const { Notification, } = require('../database');
const {middlewares} =require('../utils')
const router=Router()
const {FIREBASE_URL,SERVER_KEY} = require('../utils/variables')
const axios = require('axios')
/**
 * for demo purpose we are sending test notification 
 * 
 *          ------REMOVE---------
 */

router.get(
  '/test-notification',
  async (request,response)=>{
    const body={notification:{
      body:"Demo push notification",
      title:"Skin-Mate"
      },
     data:{
        message:""
      },
      to:'etFPAeTdQDiaTusYrLp7Uh:APA91bH4DAEJ0ZGs54cVvsJ-Pq0Qqm83DyNW5LvVmaibdzwQtbC9MW9kqRs9sxUkW7MCZ2doiOANz0ACJysB9-5wZ5jZibwm6Zyf0UCisfgnp-PvPvbla4J8xdYimyotX6EYKKb7eA2A'
    }
    axios({
      method:"POST", 
      url:FIREBASE_URL,
      headers:{
        'Content-Type':'application/json',
        //server api-key for clould messanging
        'Authorization':SERVER_KEY
      },
      data:body
    }).then(res=>{
      if(res.data.success){
        response.status(200).send(res.data)
      }
      else{
        response.status(500).send(res.data.results[0].error)
      }
    })
    .catch(err=>{
      console.log(err)
    })
  }
)
/**
 * fetching all notification for particular user  
*/  
router.get(
  '/notifications/:userId',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ phone: true, email: true }),
  async (request,response)=>{
    try {
    let res = await Notification.find({user:request.params.userId})
    if(response){
      response.status(200).send(res)
    }
    else{
      response.status(404).send("no data found")
    }
    } catch (error) {
      response.status(500).send(error)
    }
  }
)


/**
 * fetch single notification
 */
 router.get(
  '/notifications/:userId/:n_id',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ phone: true, email: true }),
  async (request,response)=>{
    try {
    let res= await Notification.findOne({user:request.params.userId,_id:request.params.n_id})
    if(response){
      response.status(200).send(res)
    }
    else{
      response.status(404).send("no data found")
    }
    } catch (error) {
      response.status(500).send(error)
    }
  }
)
/**
 * updating checking status of notification
 */
router.patch(
  '/notification/:userId',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ phone: true, email: true }),
  async(request,response)=>{
    try {
    let notification_id=request.body.n_id
    let notification = await Notification.findOne({_id:notification_id,user:request.params.userId})
  
    if(notification){
      notification.checked=true
      await notification.save()
      response.status(200).send()
    }
    else{
      response.status(404).send("notification not found")
    }
    } catch (error) {
      console.log(error)
      response.status(500).send(error)
      
    }
  })

  /**
   * delete notification 
   */

  router.delete(
    '/notification/:userId',
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async (request,response)=>{
     try {
      await Notification.deleteOne({_id:request.body.n_id,user:request.params.userId})
      .then(res=>{
        response.status(200).send()
      })
      .catch(err=>{
        response.status(404).send(err)
      })
     } catch (error) {
       response.status(500).send(error)
     }

    }

  )

  module.exports=router