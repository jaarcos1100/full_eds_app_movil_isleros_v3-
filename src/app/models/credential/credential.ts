import { Global } from '../global/global';

/**
 * Clase para pasar credenciales a login
 **/
export class Credential {
    public grant_type = "password";
    constructor(
        public document: string,
        public password: string
    ) {
    }
}
