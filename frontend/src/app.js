// import "./styles/main.scss";
import {Router} from "./router";

class App {
    constructor() {
        console.log('App.js loaded');
        new Router();
    }
}

(new App());