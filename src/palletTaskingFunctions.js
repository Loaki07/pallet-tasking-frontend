import { ApiPromise, wsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";

export const DEFAULT_ACCOUNT_IDS = {
    ALICE: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    BOB: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
};

export const TYPES = {
    Balance: "u64",
    TaskDetails: {
        task_id: "u128",
        client: "AccountId",
        worker_id: "Option<AccountId>",
        task_deadline: "u64",
        task_description: "Text",
        cost: "Balance",
        is_bidded: "bool",
        is_completed: "bool",
    },
};

/**
 * Connect to the connectToParaChainUsingDotApi
 * from the @polkadot/api
 * @param {JSON} types
 * @returns api
 */
export const connectToParaChainUsingDotApi = async (types) => {
    const api = await ApiPromise.create({
        types,
    });
    return api;
};

/**
 * Get the AccountId's from the keyring
 * for default accounts Alice and Bob
 * @returns alice and bob keyring accountId's
 */
export const getAccountsFromKeyRing = () => {
    const keyring = new Keyring({ type: "sr25519" });
    const alice = keyring.addFromUri("//Alice");
    const bob = keyring.addFromUri("//Bob");


    return { alice, bob };
};

// Sample functions for using pallet balances

/**
 * Transfer function using the pallet balances
 * Transfers money from Alice to Bob
 * @param {Number} amount
 */
export const transferTx = async (api, accountIdFromKeyRing, amount) => {
    if (api === null) return;
    const transfer = api.tx.balances.transfer(DEFAULT_ACCOUNT_IDS.BOB, amount);
    const hash = await transfer.signAndSend(accountIdFromKeyRing);
    console.log("Transfer sent with hash");
};

/**
 * Get account Balance and nounce
 * @param {*} api
 * @param {String} accountId
 * @returns
 */
export const getAccountBalance = async (api, accountId) => {
    if (api === null) return;
    // Samplet AccountId
    // const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
    let {
        data: { free: previousFree },
        nonce: previousNonce,
    } = await api.query.system.account(accountId);
    console.log(`Account Balance: ${previousFree}, Nonce: ${previousNonce}`);
    return true;
};

// Calling Dispatchables from the pallet tasking

/**
 * createTask function from the palletTasking
 * @param {*} api
 * @param {AccountId} accountIdFromKeyRing
 * @param {Number} taskDuration
 * @param {Number} taskCost
 * @param {String} taskTitle
 */
export const createTaskTx = async (
    api,
    accountIdFromKeyRing,
    taskDuration,
    taskCost,
    taskTitle,
) => {
    if (api === null) return;
    let transaction = await api.tx["palletTasking"]["createTask"](
        taskDuration,
        taskCost,
        taskTitle,
    );
    await transaction.signAndSend(accountIdFromKeyRing);
};

/**
 * bidForTask function from palletTasking
 * @param {} api
 * @param {AccountId} accountIdFromKeyRing
 * @param {Number} taskId
 */
export const bidForTaskTx = async (api, accountIdFromKeyRing, taskId) => {
    if (api === null) return;
    let transaction = api.tx["palletTasking"]["bidForTask"](taskId);
    await transaction.signAndSend(accountIdFromKeyRing);
};

/**
 * aprrove function from palletTasking
 * @param {*} api
 * @param {AccountId} accountIdFromKeyRing
 * @param {Number} taskId
 */
export const approveTaskTx = async (api, accountIdFromKeyRing, taskId) => {
    if (api === null) return;
    let transaction = api.tx.palletTasking.approveTask(taskId);
    await transaction.signAndSend(accountIdFromKeyRing);
};

/**
 * taskCompleted function from palletTasking
 * @param {*} api
 * @param {AccountId} accountIdFromKeyRing
 * @param {Number} taskId
 */
export const taskCompletedTx = async (api, accountIdFromKeyRing, taskId) => {
    if (api === null) return;
    let transaction = api.tx.palletTasking.taskCompleted(taskId);
    await transaction.signAndSend(accountIdFromKeyRing);
};

// Accessing chain storage

/**
 * TaskCount Storage value
 * from pallet tasking
 * @returns taskCount
 */
export const taskCountQuery = async (api) => {
    if (api === null) return;
    let taskCount = await api.query.palletTasking.taskCount();
    return taskCount;
};

/**
 * TaskStorage Storage value
 * from pallet tasking
 * @param {Number} taskId
 * @returns
 */
export const taskStorageQuery = async (api, taskId) => {
    if (api === null) return;
    let task = await api.query.palletTasking.taskStorage(taskId);
    return task.toHuman();
};

/**
 * Function to get all the tasks
 * from the chain storage
 * @param {*} api 
 * @returns allTasks Array
 */
export const getAllTasks = async (api) => {
    if (api === null) return;
    let taskCountFromBackEnd = await taskCountQuery(api);

    console.log(`Getting All Tasks, TaskCount at Chain: ${taskCountFromBackEnd}`);

    let taskArr = [];
    let index;

    for (index = 0; index < taskCountFromBackEnd; index++) {
        let singleTask = await taskStorageQuery(api, index);
        taskArr.push(singleTask);
    }

    console.log(`Getting All Tasks, Total Tasks from Chain: ${taskArr.length}`);
    return taskArr;
}

// Testing counter functions in pallet tasking

/**
 * increaseCounter function from pallet tasking
 * @param {*} api
 * @param {Number} accountIdFromKeyRing
 */
export const increaseCounterTx = async (api, accountIdFromKeyRing) => {
    if (api === null) return;
    // api.tx[palletRpc][callable](...transformed)
    // api.tx[palletRpc][callable]()
    let transaction = api.tx["palletTasking"]["increaseCounter"]();
    await transaction.signAndSend(accountIdFromKeyRing);
};

/**
 * Count storage value
 * from pallet tasking
 * @param {*} api
 * @returns count
 */
export const getCountFromStorage = async (api) => {
    if (api === null) return;
    let count = await api.query.palletTasking.count();
    return count;
};

// Testing get tasks
// Note: this only prints the task details
// at the backend blockchain node

/**
 * To get the task details from pallet tasking
 * @param {*} api
 * @param {Number} taskId
 * @param {Number} accountIdFromKeyRing
 * @returns
 */
export const getTaskDetails = async (api, taskId, accountIdFromKeyRing) => {
    if (api === null) return;
    let transaction = api.tx.palletTasking.getDataFromStore(taskId);
    await transaction.signAndSend(accountIdFromKeyRing);
};

/**
 * Testing transfer function from pallet tasking
 * @param {*} api
 * @param {Number} fromAccountIdFromKeyRing
 * @param {Number} toAccountId
 * @param {Number} transferAmount
 * @returns
 */
export const transferUsingPalletTasking = async (
    api,
    fromAccountIdFromKeyRing,
    toAccountId,
    transferAmount
) => {
    if (api === null) return;
    let transaction = api.tx.palletTasking.transferMoney(
        toAccountId,
        transferAmount
    );
    await transaction.signAndSend(fromAccountIdFromKeyRing);
};

// Handle on chain events

/**
 * Listening to events on the chain
 * @param {*} api
 */
export const handleOnChainEvents = async (api) => {
    if (api === null) return;
    api.query.system.events((events) => {
        console.log(`\nReceived ${events.length} events:`);

        // Loop through the Vec<EventRecord>
        events.forEach((record) => {
            // Extract the phase, event and the event types
            const { event, phase } = record;
            const types = event.typeDef;

            // Show what we are busy with
            console.log(
                `EventName \t\t${event.section}:${
                    event.method
                }:: (phase=${phase.toString()})`
            );
            console.log(`MetaData \t\t${event.meta.documentation.toString()}`);

            // Loop through each of the parameters, displaying the type and data
            event.data.forEach((data, index) => {
                console.log(
                    `Data \t\t\t${types[index].type}: ${data.toString()}`
                );
            });
        });
    });
};

/**
 * Print the chain metadata
 * @param {*} api
 */
export const getRunTimeMetaData = (api) => {
    if (api === null) return;
    let result = api.runtimeMetadata;
    console.log(`MetaData Using Api: ${result}`);
};

/**
 * Print the chain runtime version
 * @param {*} api
 */
export const getRunTimeVersion = (api) => {
    if (api === null) return;
    let result = api.runtimeVersion;
    console.log(`RuntimeVersion: ${result}`);
};