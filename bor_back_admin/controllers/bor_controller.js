const Bor=require('../models/bor_model');
const borokController={
    async getAll(req,res){
        try {
            const borok=await Bor.getAll();
            res.json(borok);
        } catch (error) {
            res.status(500).json({error:'Internal Server error'});
        }
    },
    async getByKezdoBetuk(req,res){
        const {kezdo} = req.params;
        try {
            const borok = await Bor.getByKezdoBetuk(kezdo);
            res.json(borok);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
module.exports=borokController;
