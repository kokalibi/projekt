const Bor = require('../models/bor_model');

const borokController = {
  // Összes bor lekérése
  async getAll(req, res) {
    try {
      const borok = await Bor.getAll();
      res.json(borok);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Név szerinti keresés (részlet alapján)
  async getByKezdoBetuk(req, res) {
    const { kezdo } = req.params;
    try {
      const borok = await Bor.getByKezdoBetuk(kezdo);
      res.json(borok);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Bor hozzáadása
  async addBor(req, res) {
    const bor = req.body;
    try {
      const insertId = await Bor.addBor(bor);
      res.status(201).json({ message: 'Bor added', bor_id: insertId });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Bor törlése
  async deleteBor(req, res) {
    const { id } = req.params;
    try {
      await Bor.deleteBor(id);
      res.json({ message: 'Bor deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const bor = await Bor.getById(id);
      res.json(bor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async szures(req, res) {
    try {
      const { pince, fajta, tipus, evjarat } = req.query;

      const borok = await Bor.szures({
        pince_nev: pince || null,
        fajta_nev: fajta || null,
        tipus_nev: tipus || null,
        evjarat: evjarat || null
      });

      res.json(borok);
    } catch (error) {
      console.error("Szűrés hiba:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
async updateBor(req, res) {
  try {
    const { id } = req.params;
    const adatok = req.body;

    await Bor.updateBor(id, adatok);

    res.json({ message: "Bor frissítve" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hiba történt frissítés közben" });
  }
}


};

module.exports = borokController;
