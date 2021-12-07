import { Application } from './stimulus.js';
import HelloController from './controllers/hello_controller.js';
import AuthenticationController from './controllers/authentication_controller.js';
import { getToken } from './store/auth_store.js';

console.log(getToken());

window.Stimulus = Application.start();

window.Stimulus.register('hello_controller', HelloController);
window.Stimulus.register('authentication', AuthenticationController);
