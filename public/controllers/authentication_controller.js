import {Controller} from '../stimulus.js';
import {post} from '../http/index.js';
import {setToken} from "../store/auth_store.js";

export default class AuthenticationController extends Controller {
    static targets = ['username', 'password']

    connect() {
        console.log("connected AuthenticationController")
    }

    async submit() {
        try {
            const response = await post('/auth/login', {
                username: this.usernameTarget.value,
                password: this.passwordTarget.value,
            })
            setToken(response.accessToken)

            location.href = '/auth/profile';
        } catch (err) {
            console.log(err)
        }
    }
}
