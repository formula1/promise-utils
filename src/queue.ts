import {
  Promise
} from "es6-promise";

type runnableFn = ()=>any
type resolveFn = (value: any)=>any
type rejectFn = (error: any)=>any

class Queue {
  line: Array<[
    runnableFn, resolveFn, rejectFn
  ]> = [];
  running = false;
  run(fn: runnableFn){
    const runNext = ()=>{
      if(this.line.length){
        var fnArgs = this.line.shift();
        runFn(fnArgs[0], fnArgs[1], fnArgs[2])
      } else {
        this.running = false
      }
    }
    const runFn = (
      fn: runnableFn, res: resolveFn, rej: rejectFn
    )=>{
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
        this.line.push([fn, res, rej]);
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
