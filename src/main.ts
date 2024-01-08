// import {p5} from "../libs/p5.js";
import { sketch } from "./sketch";
import p5 from "p5";
import { state } from "./utils";

new p5((p5) => sketch(p5, state), document.querySelector("#sketch") as HTMLElement);
