const cors = require("cors")
const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require('body-parser')

const dotenv = require('dotenv');
let dotenvExpand = require('dotenv-expand')
let env = dotenv.config()
dotenvExpand.expand(env)

const CONNECTION_STRING = process.env.CONNECTION_STRING
const PORT = process.env.PORT || 3001

mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Thread = require("./model/threads");
const Reply = require("./model/replies");
const Like = require("./model/likes");
const User = require("./model/users");
const { response } = require("express");

const app = express()

app.use('/healthcheck', require('./routes/healthcheck.js'));
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(bodyParser.json());

app.get("/", (request, response)=>{
   response.set("http_status",200)
   response.set("cache-control",  "no-cache")
   response.set('Content-Type', 'application/json');
   body={"status": "available"}
   response.status(200).send(body)

   User.create
})

app.get("/threads", async (request, response)=>{
   const threads = Thread.find().then((threads)=> {
      response.json(threads)
   })
})

app.post("/threads", async (request, response)=>{
   let thread = new Thread(request.body)
   thread.save()
   response.status(200).json(thread)
})

app.get("/threads/:id", async (request, response)=> {
   let thread
   try{
   thread = await Thread.findById(request.params.id)
   }catch(e){
      response.status(400).send("Bad Request")
   }
   if(thread){
      response.status(200).json(thread)
   }else{
      response.status(404).send("Thread not found!")
   }
})

app.get("/threads/:id/replies", (request, response)=> {

})

app.post("/threads/:id/replies", async (request, response)=> {
   let thread;
   try{
      thread = await Thread.findById(request.params.id)
   }catch(e){
      response.status(400).send("Bad Request")
   }
   if(thread){
      request.body.time = new Date();
      const reply = new Reply(request.body);
      thread.replies.push(reply);
      await reply.save();
      await thread.save();
      response.status(201).end();

   }else{
      response.status(404).send("Not found");
   }
})

app.post("/threads/:threadId/replies/:replyId/like", (request, response)=> {
   console.log(request.params)
   body={"threadId":request.params.threadId, "replyId": request.params.replyId}
   response.status(200).send(body)
})

app.delete("/threads/:threadId/replies/:replyId/like", (request, response)=> {
   console.log(request.params)
   body={"threadId":request.params.threadId, "replyId": request.params.replyId}
   response.status(200).send(body)
})


//curl -X POST http://localhost:3001/users -H 'Content-Type: application/json' -d "{\"username\":\"nisse\",\"password\":\"password\"}"
//Create
app.post("/users", (request, response) => {
   console.log(request.body)
   let user = new User(request.body)
   user.save()
   response.status(200).send(request.body)
})


app.get("/users/:id", (request, response)=> {
   console.log(request.params.id)
   try {
      User.findById(request.params.id, (err, user) => {
         if (user) {
            response.status(200).json(user)
         } else {
            response.status(404).send("Not found")
         }
      })
   } catch (e) {
      console.error(e)
      response.status(400).send("Bad request")
   }
})

app.listen(PORT , ()=>{
     console.log(`STARTED LISTENING ON PORT ${PORT}`)
})