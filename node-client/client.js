var MessageQueue = require('svmq');

var queue = MessageQueue.open(310898);
queue.pop({ type: 1 }, (err, data) => {
  console.log(String(data));
});