/* 
TODO: sviluppare e ricercare quale pizza è stata creata per prima con il promise.race
modificare le promises cosi che le pizze vengano prodotte non in ordine cronologico ma in ordine casuale
creare dei codici identificativi per le pizze(pizza n1 ecc)
creare uno state delle pizze per cui vengano date delle specifiche cosi che ogni pizza
ha 4 state durante la preparazione: impastamento, condimento, forno e pronta o bruciata
dare dei tempi casuali rendendoli nonostante ciò cornologici con l'ordine degli states
*/

let selectedPizzas = [];

function addPizzaToOrder(pizza) {
    selectedPizzas.push(pizza);
    document.getElementById("orderMessage").innerText = `${pizza} aggiunta all'ordine.`;
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

function confirmOrder() {
    document.getElementById("orderMessage").innerText = "Preparazione delle pizze in corso...";
    document.getElementById("orderMenu").classList.add("hidden");

    let orderPromises = selectedPizzas.map((pizza) => orderPizza(pizza));

    orderPromises.forEach((promise, index) => {
        promise
            .then((pz) => {
                updateOrderMessage(`La pizza ${pz.name} è pronta!`);
            })
            .catch((error) => {
                updateOrderMessage(error);
            });
    });

    Promise.all(orderPromises)
        .then(() => {
            document.getElementById("summary").innerText += "\nOrdine completato!";
            selectedPizzas = [];
        })
        .catch((error) => {
            console.log(error);
        });
}

function cancelOrder() {
    selectedPizzas = [];
    document.getElementById("orderMenu").classList.add("hidden");
    document.getElementById("orderMessage").innerText = "Ordine annullato.";
}

function orderPizza(pizza) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let success = Math.random() > 0.2;

            if (success) {
                resolve(new Pizza(pizza));
            } else {
                reject(`La pizza ${pizza} è stata bruciata da Gino.`);
            }
        }, 3000); 
    });
}

function updateOrderMessage(message) {
    const orderMessage = document.getElementById("orderMessage");
    orderMessage.innerText += `\n${message}`;
}

// let pz1 = "4 formaggi";
// let pr1 = orderPizza(pz1);
// console.log("sto aspettando la pizza");
// pr1.then(message=>console.log(message));
// pr1.catch(error=>console.log(error));
// console.log("sto ancora aspettando sta pizza");

function Pizza(name){
    this.name = name;
}