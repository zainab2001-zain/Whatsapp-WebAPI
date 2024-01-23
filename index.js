    const express=require("express");
    const body_parser=require("body-parser");
    const axios=require("axios");
    require('dotenv').config();
    const token=process.env.TOKEN;
    const mytoken=process.env.MYTOKEN;
    const app=express().use(body_parser.json());
    app.listen(8000||process.env.PORT,()=>{
        console.log("webhook is listening...");
    });

    //get request for verifying  callback url
    app.get("/webhook",(req,res)=>{
    let mode= req.query["hub.mode"];
    let challenge=req.query["hub.challenge"];
    let token=req.query["hub.verify_token"];
    console.log(res.status);
    if(mode && token){
        
        if(mode=="subscribe" &&  token==mytoken){
            res.status(200).send(challenge);
        }
        else{
            res.status(403);
        }
    }
    });

    //post request
    app.post("/webhook",(req,res)=>{
        let body_param=req.body;
        console.log(JSON.stringify(body_param,null,2));
        if(body_param.object){
            if(body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.message &&
            body_param.entry[0].changes[0].value.message[0])
            {
                let phone_no_id=body_param.entry[0].changes.value.metadata.phone_number_id;
                let from=body_param.entry[0].changes.value.messages[0].from;
                let message_body=body_param.entry[0].changes.value.messages[0].text.body;
                axios({
                    method:"POST",
                    url:"https://graph.facebook.com/v18.0/"+phone_no_id+"/messages?access_token="+token,
                    data:{
                        messaging_product:"whatsapp",
                        to:from,
                        text:{
                            body:"Hi i am zainab"
                        }
                    },
                        headers:{
                            "Content-Type":"application/json"
                        }
                });
                
                res.sendStatus(200);
            }
            else{
                res.sendStatus(404);
            }
        }
        });
        