const models = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const signUp = (req,res)=> {

    models.User.findOne({
        where:{email:req.body.email}
    }).then(result=>{
        console.log(result)
        if(result)
            return res.status(409).json({
                message: "Email already exist"
            })
        else{
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(req.body.password,salt,(err,hash)=>{
                    const user = {
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    }
                    models.User.create(user).then(result=>{
                        res.status(201).json({
                            message: "Saved",
                            result
                        })
                    }).catch(error=>{
                        res.status(201).json({
                            message: "Something went wrong",
                            error
                        })
                    })
                })
            })
        }
    })
}

const update = (req,res)=>{
    const id = req.params.id
    const user = {
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    }
        
    models.User.update(user,{
        where:{
            id
        }   
    }).then(result=>{
        res.status(200).json({
            message : "successfully updated"
        })
    }).catch(error=>{
        res.json({
            error
        })
    })
}
    
const deleteUser = (req,res)=>{
    const id = req.params.id
    models.User.destroy({
        where:{
            id
        }
    }).then(result=>{
        res.json({
            message : "User deleted"
        })
    }).catch(error=>{
        res.json({
            message : "Something went wrong"
        })
    })
}

const login = (req,res)=>{
    models.User.findOne({where:{email:req.body.email}}).then(user=>{
        if(user === null)
            return res.send({
                message : "Email not found"
            })
        bcrypt.compare(req.body.password, user.password, (err,result)=>{
            if(result){
                const token = jwt.sign({
                    email : user.email,
                    id: user.id
                },"Lkasarkar", (err,token)=>{
                    res.status(200).json({
                        message : "Authentication successful!",
                        token
                    })
                })
            }
            else
                return res.send({
                    message : "Password mismatch"
                })
        })
    })
}

const reqForBook = (req,res)=>{
    const request = {
        isbn : req.body.isbn,
        userid : req.body.id,
        issuedOn : null,
        dueOn : null,
        status : 0
    }
    models.Borrowlog.create(request).then(req => res.status(201).json(req)).catch(err=>res.json(err))
}

module.exports = {
    signUp,
    update,
    deleteUser,
    login,
    reqForBook
}