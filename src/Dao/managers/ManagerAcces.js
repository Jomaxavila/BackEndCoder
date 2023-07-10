import fs from 'fs';
import __dirname from '../../utils.js';

export default class ManagerAcces{
	async crearRegistro(metodo){

		const fecha = new Date().toLocaleDateString();
		const hora = new Date().toLocaleTimeString();
		const message = `\nfecha:${fecha} - hora:${hora} - metodo:${metodo}`
		console.log(message);
		await fs.promises.appendFile(__dirname + '/Dao/managers/log.txt',message ,(err)=>{
			return err;
		})
	}
}