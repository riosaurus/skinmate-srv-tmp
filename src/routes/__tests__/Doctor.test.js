const request=require('supertest')
const app=require('../../index')


//expecting unauthorized request [401] (not having access token and user-agent)
test('should consider unauthorized ',async()=>{
  await request(app).post('/doctors').send({
    name:"pv bhat",
    email:'pvbhat@gmail.com',
    phone:"+919999999999",
    qualification:"MBBS"
  }).expect(401)
})