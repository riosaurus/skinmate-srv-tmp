const { Router } = require('express');
const { Notification } = require('../database');
const {middlewares} =require('../utils')
const router=Router()
const push_notification=require('../utils/push-notification')

/**
 * for demo purpose we are sending test notification 
 * 
 *          ------REMOVE---------
 */

router.get(
  '/test-notification',
  async (request,response)=>{
    try {
      await push_notification.trigger('create','etFPAeTdQDiaTusYrLp7Uh:APA91bH4DAEJ0ZGs54cVvsJ-Pq0Qqm83DyNW5LvVmaibdzwQtbC9MW9kqRs9sxUkW7MCZ2doiOANz0ACJysB9-5wZ5jZibwm6Zyf0UCisfgnp-PvPvbla4J8xdYimyotX6EYKKb7eA2A')
      response.status(200).send("notification sent")
    } catch (error) {
      response.status(500).send("error occured while sending notification")
    }

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
  async (request,response)=>{
    try {
      let notification_id=req.body.n_id
    let notifcation=await Notification.find({_id:notification_id,user:request.params.userId})
    if(notifcation){
      notifcation.checked=true
      await notification.save()
      response.status(200).send()
    }
    else{
      response.status(404).send("notification not found")
    }
    } catch (error) {
      response.status(500).send(error)
    }
  })

  /**
   * delete notification 
   */

  router.delete(
    'notification/:userId/:n_id',
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async (request,response)=>{
     try {
      await Notification.deleteOne({_id:request.params.n_id,user:request.params.userId})
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