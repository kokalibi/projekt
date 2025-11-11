const Bor = require('../models/bor_model');

const borokController = {
  async getAll(req, res) {
    try {
      const borok = await Bor.getAll();
      res.json(borok);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getByKezdoBetuk(req, res) {
    const { kezdo } = req.params;
    try {
      const borok = await Bor.getByKezdoBetuk(kezdo);
      res.json(borok);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async addBor(req, res) {
    const bor = req.body;
    try {
      const insertId = await Bor.addBor(bor);
      res.status(201).json({ message: 'Bor added', bor_id: insertId });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async deleteBor(req, res) {
    const { id } = req.params;
    try {
      await Bor.deleteBor(id);
      res.json({ message: 'Bor deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getByTipusNev(req, res) {
    const { tipus_nev } = req.params;
    try {
      const borok = await Bor.getByTipusNev(tipus_nev);
      res.json(borok);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getByFajtaNev(req, res) {
    const { fajta_nev } = req.params;
    try {
      const borok = await Bor.getByFajtaNev(fajta_nev);
      res.json(borok);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getByEvjarat(req, res) {
    const { evjarat } = req.params;
    try {
      const borok = await Bor.getByEvjarat(evjarat);
      res.json(borok);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getByPinceNev(req, res) {
    const { pince_nev } = req.params;
    try {
      const borok = await Bor.getByPinceNev(pince_nev);
      res.json(borok);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = borokController;
