pragma solidity ^0.5.0;

contract TodoList {
  uint public taskCount = 0;

  struct Task {
    uint id;
    string content;
    bool completed;
    bool deleted;
  }

  mapping(uint => Task) public tasks;

  event TaskCreated(
    uint id,
    string content,
    bool completed,
    bool deleted
  );

  event TaskCompleted(
    uint id,
    bool completed
  );

  event TaskDeleted(
    uint id,
    bool deleted
  );

  constructor() public {
    createTask('Check out this default task');
  }

  function createTask(string memory _content) public {
    taskCount ++;
    tasks[taskCount] = Task(taskCount, _content, false, false);
    emit TaskCreated(taskCount, _content, false, false);
  }

  function toggleCompleted(uint _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    tasks[_id] = _task;
    emit TaskCompleted(_id, _task.completed);
  }

  function deleteTask(uint _id) public {
    Task memory _task = tasks[_id];
    _task.deleted = true;
    tasks[_id] = _task;
    emit TaskDeleted(_id, false);
  }
}