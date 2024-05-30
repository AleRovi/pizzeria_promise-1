let selectedPizzas = [];
let pizzaCounter = 1; 

function addPizzaToOrder(pizza) {
    const pizzaName = `${pizza} n${pizzaCounter}`; // Aggiunge un identificativo univoco
    selectedPizzas.push(pizzaName);
    document.getElementById("orderMessage").innerText = `${pizzaName} aggiunta all'ordine.`;
    pizzaCounter++; // Incrementa il contatore per il prossimo identificativo
}

function showOrderMenu() {
    if (selectedPizzas.length === 0) {
        alert("Seleziona almeno una pizza prima di confermare l'ordine.");
        return;
    }

    const orderList = document.getElementById("orderList");
    orderList.innerHTML = "";
    selectedPizzas.forEach((pizza) => {
        const li = document.createElement("li");
        li.innerText = pizza;
        orderList.appendChild(li);
    });

    document.getElementById("orderMenu").classList.remove("hidden");
}

async function confirmOrder(){
    document.getElementById("orderMessage").innerText = "Preparazione delle pizze in corso...";
    document.getElementById("orderMenu").classList.add("hidden");
    try {
        const racePromises = selectedPizzas.map((pizza) => orderPizza(pizza).then(() => pizza));
        const winnerPizza = await Promise.race(racePromises);
        updateOrderMessage(`La pizza ${winnerPizza} è stata completata per prima!`);
    } catch (error) {
        updateOrderMessage(`Errore nella preparazione della pizza: ${error}`);
    }
}

function cancelOrder() {
    selectedPizzas = [];
    document.getElementById("orderMenu").classList.add("hidden");
    document.getElementById("orderMessage").innerText = "Ordine annullato.";
}

async function orderPizza(pizza){
    let currentState = 'impastamento';

    const updateState = (state) => {
        currentState = state;
        updateOrderMessage(`Stato della pizza ${pizza}: ${state}`);
    };

    const transitionTo = (state) => {
        const randomDelay = Math.floor(Math.random() * 3000) + 1000; // Ritardo casuale tra 1 e 4 secondi
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                updateState(state);
                resolve();
            }, randomDelay);
        });        
    };

    const states = {
        impastamento: async () => await transitionTo('condimento'),
        condimento: async () => await transitionTo('forno'),
        forno: async () => {
            let success = Math.random() > 0.2;
            if (success) {
                await transitionTo('pronta');
            } else {
                await transitionTo('bruciata');
            }
        }
    };

    const nextState = () => {
        const nextStateFunction = states[currentState];
        if (nextStateFunction){
            return nextStateFunction();
        }
        return Promise.reject(`Errore: Stato sconosciuto ${currentState}`);
    };

    const runStateMachine = async () => {
        await nextState();
        if (!(currentState === 'pronta' || currentState === 'bruciata')) {
                await runStateMachine();  
        };
    };

    updateState('impastamento');
    await runStateMachine();
    if (currentState === 'pronta'){
        updateOrderMessage(`La pizza ${pizza} è pronta!`);
    } else if (currentState === 'bruciata') {
        updateOrderMessage(`La pizza ${pizza} è stata bruciata da gino!`);
    }

}

function updateOrderMessage(message) {
    const orderMessage = document.getElementById("orderMessage");
    orderMessage.innerText += `\n${message}`;
}






