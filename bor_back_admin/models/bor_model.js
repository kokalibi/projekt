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

module.exports = Borok;
