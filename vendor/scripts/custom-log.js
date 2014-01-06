if (typeof DEBUG === 'undefined') {
  DEBUG = true;
}
window.LOG = function(){
  DEBUG && console.log.apply(console,arguments);
};