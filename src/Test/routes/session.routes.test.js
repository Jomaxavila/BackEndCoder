import { expect } from "chai";
import { dropPets, dropUser } from "./setup.test.js";
import supertest from "supertest";


const requester = supertest("http://localhost:3000");

describe ('Session router test case', ()=>{

it ('[POST]/api/session/register sing up a user successfully', async()=>{

	await dropUser();
	const mockUser={
		first_name:"Prueba",
		last_name:"Test",
		email:"correo@correo.com",
		age:"40",
		password:"pwd"
	}

	const response = await requester.post('/api/session/register').send(mockUser)
	expect(response.statusCode).to.be.eql(200)
})

it('[POST] /api/session/login - loguear un usuario exitosamente', async function () {
	const mockUserCredentials = {
		email: 'correo@correo.com',
		password: 'pwd'
	}
	const response = await requester.post('/api/sessions/login').send(mockUserCredentials)
	const cookieHeader = response.headers['set-cookie'][0]
	console.log(cookieHeader)
	// expect(response.statusCode).to.be.equal(200)
})

})