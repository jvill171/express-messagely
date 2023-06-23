const express = require("express");
const router = new express.Router();

const Message = require("../models/message");
const { ensureLoggedIn } = require("../middleware/auth");
const ExpressError = require("../expressError");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", async (req, res, next)=>{
    try{
        const message = await Message.get(req.params.id);
        // If logged-in user is neither sender / recepient
        if(![message.from_user.username, message.to_user.username].includes(req.user.username)){
            throw new ExpressError("Unauthorized", 401)
        }
        return res.json({message})
    } catch(err){
        return next(err)
    }
})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", ensureLoggedIn, async (req, res, next)=>{
    try{
        // Set the from_username in the req.body using the 
        // logged-in user as the sender.
        req.body.from_username = req.user.username;
        
        const message = await Message.create(req.body)
        return res.status(201).json({message})
    } catch(err){
        return next(err)
    }
})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", async (req, res, next)=>{
    try{
        const msg = await Message.get(req.params.id);
        if(req.user.username != msg.to_user.username){
            throw new ExpressError("Unauthorized", 401);
        }
        const message = await Message.markRead(msg.id)
        return res.json({message})
    } catch(err){
        return next(err)
    }
})

module.exports = router;