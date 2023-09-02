import { SaveUsersDTO } from "../dtos/users.dto.js";

export class ContactsRepository{
    constructor(){

    }
    async getAllContacts(){
        return await this.dao.getAll();
    }
    async saveContact(payload){
        const contactPayload = new SaveUsersDTO(payload)
        return await this.dao.save(contactPayload)
    }
}