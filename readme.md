
# Ethereum Todo App

This is a simple **todo** add that runs on the Ethereum Virtual Machine. This uses the **truffle** framework for development and testing and **Solidity** for handling smart contracts.

This example was source from [this repo](https://github.com/dappuniversity/eth-todo-list), which has a corresponding video tutorial [here](https://www.youtube.com/watch?v=coQ5dg8wM2o).

# Setup
## Install packages
```
npm install
// or
yarn install
```
## Install additional tools

### Ganache
Download the Ganache gui to allow running a local instance of an ethereum blockchain. You can download it for OSX [here](https://trufflesuite.com/ganache/).

Once you've downloaded the gui, open it and click on `Quick start` and run the default ethereum blockchain. It should contain a list of a few example transactions linked to various addresses that are randomly created during the `Quick start` process. This can be adjusted via the Ganache settings later if you'd like, but you can keep it as is for now.
 
### MetaMask
Download the MetaMask Google Chrome extension.

Then setup MetaMask with a login password, save the seed phrase, etc. These should all be basic steps that you need to take if this is your first time setting up MetaMask.

Then create a new network with the below settings:
```
Network Name: "HTTP://127.0.0.1:7545" <-- This value can be anything you'd like.
New RPC URL: "HTTP://127.0.0.1:7545"
Chain ID: "1337"
Currency Symbol: "ETH" <-- This can be whatever symbol you want to use, but you can keep it at "ETH" for now.
```

## Run the Solidity smart contract migrations
To run the migration script run the below command in the terminal from the project root.
```
truffle migrate

// If you want to clear out the data then you can add the "--reset" flag
truffle migrate --reset
```

Once the migration script is run, you should see the transaction list update in Ganache. The first transaction in the list should have slightly less `ETH` in its balance due to the fact that a new transaction was run and the Ganache default settings will automatically mimic a fake gas fee to be added to all transactions.

## Add account to MetaMask
A little background. Typically when dealing with a blockchain, like Ethereum or Bitcoin, you, as a user, will need to create a wallet that contains a new address for that cryptocurrency. Wallets can contains any number of addresses. When you want to send/receive/buy cryptocurrency or run any transaction via a smart contract you use your address as the to/from address.

In this Todo App example we're doing things a bit differently. We first create some fake transactions on a fake blockchain that is running locally, via Ganache. Then we take an address that was created by Ganache and use it as if it was a wallet address of our own. There may be a way to create the wallet address first and then tell Ganache to use that when spinning up its fake blockchain, but we're not going to cover that flow in this example. 

Given the above this is what we'll do:

- Click on the key icon of the first transaction (the top most transaction) in the Ganache gui.
- Copy the `PRIVATE KEY` value.
- Open MetaMask in your Chrome browser.
- At the top right there should be a circle icon that should have an option to `Import Account`. Click on that.
- Paste the private key in the input. You can keep the `Select Type` drop down to `Private Key`.
- Once you import you need to then connect the account. This is specifically a MetaMask setting in which you tell MetaMask you allow certain account to connect to certain web pages.

## Run the lite-server
At this point we can now run the lite-server to spin up our local frontend and interact with the Todo App.
```
npm run dev
// or
yarn dev
```

This should open a new browser page at `localhost:3000` with one task that should say `Check out this default task`.

You should be able to add new tasks by typing in something in the input field of the page and then hitting `Enter`. This should open the MetaMask extension to confirm the requested transaction to update the blockchain to add the new task.

You can also toggle the completed state of any task in the similar fashion. Click on the checkbox next to any task should also open the MetaMask extension and will ask you to confirm the transaction to update the `completed` state of a given task on the blockchain. 