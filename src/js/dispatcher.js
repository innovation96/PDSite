import EventEmitter from 'events';
const dispatcher = new EventEmitter();
dispatcher.setMaxListeners(50);
export default dispatcher;
