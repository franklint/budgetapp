let db; 

// establish a connection to IndexedDB database called 'budget_tracker' and set it to version 1
const request = indexedDB.open('budget_tracker', 1);

// this event will emit if the database version changes
request.onupgradeneeded = function(event) {

    // save a reference to the database
    const db = event.target.result;

    // create an object store (table) called `new_transaction`, set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_transaction', { autoIncrement: true });
};

// upon a successful
request.onsuccess = function(event) {

    
    db = event.target.result;

    if (navigator.onLine) {

    }
};

request.onerror = function(event) {
 
    console.log(event.target.errorCode);
};


function saveRecord(record) {

    
    const transaction = db.transaction(['new_transaction'], 'readwrite');


    const  budgetObjectStore = transaction.objectStore('new_transaction');

    
    budgetObjectStore.add(record);
}

function uploadTransaction() {

   
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    
    const budgetObjectStore = transaction.objectStore('new_transaction');

    
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {

        // if there was data in indexedDb's store send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }

                    // open one more transaction
                    const transaction = db.transaction(['new_transaction'], 'readwrite');

                    // access the new_transaction object store
                    const budgetObjectStore = transaction.objectStore('new_transaction');

                    // clear all items in your store
                    budgetObjectStore.clear();

                    alert('All saved transactions has been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}

// listen for app coming back online
window.addEventListener('online', uploadTransaction);