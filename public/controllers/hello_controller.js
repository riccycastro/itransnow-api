import {Controller} from "../stimulus.js"

export default class HelloController extends Controller {
    static targets = ["name"]

    connect() {
        console.log("connected")
    }
}
