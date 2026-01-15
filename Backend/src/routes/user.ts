import { Router } from "express";
import { requireAuth,requireAdmin } from "../middlewares/auth";
import {  } from "module";
const router=Router()
router.get("/me",requireAdmin,(req,res)=>{
    res.send("Hello world")
})

export default router