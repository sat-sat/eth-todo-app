App = {
  loading: false,

  contracts: {},

  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContracts();
    await App.render();
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    /**
     * The code below is slightly different from the above reference
     * to the medium article that provides an example of how to create
     * a new instance of the Web3 constructor. Since MetaMask changed
     * its API slightly since the publishing of the above article,
     * the below code is a stripped down version of what's actually
     * necessary to support the new way of instantiating the Web3 constructor.
     */
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      App.web3Provider = window.web3.currentProvider
      try {
        // Request account access if needed
        await window.ethereum.request('eth_requestAccounts')
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    const accounts = web3.eth.accounts;
    const firstAccount = accounts[0]

    if (!firstAccount) {
      setTimeout(() => {
        return App.loadAccount();
      }, 200);
    }
    
    App.account = firstAccount;
  },

  loadContracts: async () => {
    const todoList = await $.getJSON('TodoList.json'); 
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider);
    
    // Hydrate the smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed();
  },

  setLoading: (val) => {
    App.loading = val;

    const loader = $('#loader');
    const content = $('#content');
    
    if (val === true) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },

  renderTasks: async () => {
    // Load the total task count form the blockchain
    const _taskCount = await App.todoList.taskCount();
    const taskCount = _taskCount.c;
    const $taskTemplate = $('.taskTemplate');

    taskCount.forEach(async (i) => {
      const task = await App.todoList.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];
      
      const $newTaskTemplate = $taskTemplate.clone();
      $newTaskTemplate.find('.content').html(taskContent);
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      // .on('click', App.toggleCompleted)

      // Clear out the task list and re-append all tasks
      $('#completedTaskList').empty()
      $('#taskList').empty()

      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate);
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      // Show the task
      $newTaskTemplate.show();
    })

    // Render out each task with a new task template
  },

  render: async () => {
    // Recursive function to continue render attempt
    // until polling for this account is available
    if (!App.account) {
      console.log('here -------------')
      setTimeout(() => {
        return App.render();
      }, 200);
    }

    // Prevent double render
    if (App.loading) return;

    // Update app loading state
    App.setLoading(true);

    // Render account
    $('#account').html(App.account);

    // Render tasks
    await App.renderTasks();

    // Update app loading state
    App.setLoading(false)
  }
}

$(() => {
  $(window).load(() => {
    App.load();
  })
})