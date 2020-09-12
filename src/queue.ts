import {
  Promise
} from "es6-promise";

class Queue {
  line = [];
  running = false;
  run(fn: ()=>any){
    const runNext = ()=>{
      if(this.line.length){
        var fnArgs = this.line.shift();
        runFn(fnArgs[0], fnArgs[1], fnArgs[2])
      } else {
        this.running = false
      }
    }
    const runFn = (fn, res, rej)=>{
      return Promise.resolve().then(()=>{
        return fn()
      }).then((v)=>{
        res(v)
        runNext()
      }, (e)=>{
        rej(e);
        runNext()
      })
    }

    return new Promise((res, rej)=>{
      if(this.running){
        this.line.push(fn, res, rej);
      }else{
        this.running = true
        runFn(fn, res, rej);
      }
    });
  }
}

export {
  Queue
}
