const cors = require("cors")
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const { response } = require("express")
mongoose.connect("mongodb+srv://firstuser:example@firstcluster.ixwye.mongodb.net/test-db?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Thread = require("./model/threads");
const Reply = require("./model/replies");
const Like = require("./model/likes");
const User = require("./model/users");

const app = express()
const PORT = process.env.PORT || 3001

app.use('/healthcheck', require('./routes/healthcheck.js'));
app.use(express.urlencoded({extended: true}));
app.use(cors())
app.use(bodyParser.json());

app.get("/", (request, response) => {
    headers={"http_status":200, "cache-control": "no-cache"}
    body={"status": "available"}
    response.set('Content-Type', 'application/json');
    response.status(200).send(body)
})

app.get("/threads", (request, response)=>{

    body = {"status": 
    [
        {"id":"1"}
        ,{"id":"2"}
        ,{"id":"3"}
        ,{"id":"4"}
    ]}
    response.status(200).send(body)
})

app.post("/threads", (request, response)=>{
    console.log(request.body)

    body = {"threads": 
    [
        {"id":"1"}
        ,{"id":"2"}
        ,{"id":"3"}
        ,{"id":"4"}
    ]}
    response.status(200).send(body)
})

app.get("/threads/:id", (request, response)=>{
    console.log(request.params)
    body = {"id":request.params.id}
    response.status(200).send(body)
})

app.get("/threads/:id/replies", (request, response)=>{
    console.log(request.params)
    body = {"id":request.params.id, "replies": [{"id":1, "reply": "any reply", "id":1}, {"reply": "another reply"}]}
    response.status(200).send(body)
})

app.post("/threads/:threadId/replies/:replyId/like", (request, response)=>{
    console.log(request.params)
    body = {"threadId":request.params.threadId, "replyId": request.params.replyId}
    response.status(200).send(body)
})

app.delete("/threads/:threadId/replies/:replyId/like", (request, response)=>{
    console.log(request.params)
    body = {"threadId":request.params.threadId, "replyId": request.params.replyId}
    response.status(200).send(body)
})

app.post("/users/", (request, response) => {
    console.log(request.body)
    body={"threadId":request.params.threadId, "replyId": request.params.replyId}
    let user = new User(request.body)
    user.save()
    console.log(user)
    response.status(200).send(request.body)
})

/*app.get("/users/:id", (request, response) => {
    let user;
    try {
        user = User.findById(request.params.id)
    } catch (e) {
        response.status(400).send("Bad request")
    }
    if (user) {
        console.log(user)
        response.status(200).json(user)
    } else {
        response.status(404).send("Not found")
    }
})
*/

app.get("/users/:id", (request, response) => {
    console.log(request.params.id)
    try {
        User.findById(request.params.id, (err, user) => {
            console.log(user)
            if(err) throw error;
            if(user) {
                response.status(200).json(user)
    }else {
        response.status(404).send("Not found")
        }
    })
    }catch(e){
        response.status(400).send("Bad request")
    }
})


app.delete("/users/:id", (request, response) => {
    try {
        User.deleteOne({ _id: request.params.id });
    } catch (e) {
        response.status(400).send("Bad request");
    }
    response.status(200).end();
})

app.listen(PORT , ()=>{
    console.log(`STARTED LISTENING ON PORT ${PORT}`)
})