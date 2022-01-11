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
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      App.web3Provider = window.web3.currentProvider;
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */});
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  },

  loadAccount: async () => {
    const selectedAddress = web3.currentProvider.selectedAddress;

    if (!selectedAddress) {
      setTimeout(() => {
        return App.loadAccount();
      }, 200);
    } else {
      App.account = selectedAddress;
      web3.eth.defaultAccount = selectedAddress
    }
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

  createTask: async () => {
    App.setLoading(true);
    const content = $('#newTask').val();
    await App.todoList.createTask(content);
    window.location.reload();
  },

  toggleCompleted: async (e) => {
    App.setLoading(true);
    const taskId = e.target.name;
    await App.todoList.toggleCompleted(taskId);
    window.location.reload();
  },

  deleteTask: async (e) => {
    App.setLoading(true);
    const taskId = e.target.name;
    await App.todoList.deleteTask(taskId);
    window.location.reload();
  },

  renderTasks: async () => {
    // Load the total task count form the blockchain
    const taskCount = await App.todoList.taskCount()
    const $taskTemplate = $('.taskTemplate');

    // Clear out the task list and re-append all tasks
    $('#completedTaskList').empty()
    $('#taskList').empty()

    for (let i = 1; i <= taskCount; i++) {
      const task = await App.todoList.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];
      const taskDeleted = task[3];

      if (taskDeleted) return;
      
      const $newTaskTemplate = $taskTemplate.clone();
      $newTaskTemplate.find('.content').html(taskContent);
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      .on('click', App.toggleCompleted)
      $newTaskTemplate.find('button')
                      .prop('name', taskId)
                      .on('click', App.deleteTask);

      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate);
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      // Show the task
      $newTaskTemplate.show();
    }

    // Render out each task with a new task template
  },

  render: async () => {
    // Recursive function to continue render attempt
    // until polling for this account is available
    if (!App.account) {
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