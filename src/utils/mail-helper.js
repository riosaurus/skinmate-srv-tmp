const SUBJECT=`Verify Your Email Address`
const HTML=(url,_id)=>{
  let html=`
  <p style="font-size:'1rem'">Hii , click below button to verify your email address in skin mate account</p>
 <a style="text-align:'center'" href="${url}/emailverification/${_id}"><button style="color:#fff;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;padding:1rem;border: none;border-radius: 6px;background-color: rgb(2, 2, 122);margin-top:15px;margin-left:25%;">Verify Email Address</button></a>
  `
  return html
}

module.exports={
  SUBJECT,
  HTML
}