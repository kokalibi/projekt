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
    },
    async addBor(req,res){
        const bor=req.body;
        try {
            const insertId=await Bor.addBor(bor);
            res.status(201).json({message:'Bor added', bor_id:insertId});
        } catch (error) {
            res.status(500).json({error:'Internal Server error'});
        }
    },
    async deleteBor(req,res){
        const {id}=req.params;
        try {
            await Bor.deleteBor(id);
            res.json({message:'Bor deleted'});
        } catch (error) {
            res.status(500).json({error:'Internal Server error'});
        }
    },
    // meg at kell gondolni
    async getByTipusId(req,res){
        const {tipus_id}=req.params;
        try {
            const borok=await Bor.GetBytipusId(tipus_id);
            res.json(borok);
        } catch (error) {
            res.status(500).json({error:'Internal Server error'});
        }
    },
    async getByFajtaId(req,res){
        const {fajta_id}=req.params;
        try {
            const borok=await Bor.GetByfajtaId(fajta_id);
            res.json(borok);
        } catch (error) {
            res.status(500).json({error:'Internal Server error'});
        }
    },
    async getByEvjaratId(req,res){
        const {evjarat_id}=req.params;
        try {
            const borok=await Bor.GetByevjaratId(evjarat_id);
            res.json(borok);
        }
        catch (error) {
            res.status(500).json({error:'Internal Server error'});
        }
    },
    async getByPinceId(req,res){
        const {pince_id}=req.params;
        try {
            const borok=await Bor.GetBypinceId(pince_id);
            res.json(borok);
        }
        catch (error) {
            res.status(500).json({error:'Internal Server error'});
        }
    }
};
module.exports=borokController;
