const { Router} = require("express");
const router=Router()
const Locations=require('../assets/location.json')


/**
 * providing location for live search
 * @param {string} loc *location key to search
 * @returns {Array} *matching location array
 * @default []
  */

router.get(
  '/location/:loc',

  async(request,response)=>{

    try {
      let param=request.params.loc
      let f_location=Locations
      .filter(location=>location.name.toString().toLowerCase().includes(param.toString().toLowerCase()))
      response.status(200).send(f_location)
    } catch (error) {
      response.status(500).send(error)
    }

  })

module.exports=router 