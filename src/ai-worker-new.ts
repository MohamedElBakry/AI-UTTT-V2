import { Agent } from "./ai";

onmessage = (event) => {
    const agent = Agent.workerFrom(event.data[0]);
    const [depth, state, alpha, beta, isMaxing, move] = event.data.slice(1, event.data.length);

    const score = agent.miniMaxAlphaBetaPruning(depth, state, alpha, beta, isMaxing);
    postMessage([score, move]);
}
