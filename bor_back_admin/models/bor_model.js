const pool = require('../config/db');
const Borok={};
Borok.getAll = async () =>{
    try{
        const [rows] = await pool.query("Select * from borok");
        return rows;
    }
    catch(error){
        console.error(error)
        throw error;
    }
};
Borok.getByKezdoBetuk = async (kezdo) => {
    try {
        const [rows] = await pool.query("SELECT * FROM borok WHERE nev LIKE ?", [kezdo + '%']);
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


module.exports = Borok;
