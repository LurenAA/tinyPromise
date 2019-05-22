const TinyPromise = require('./Promise')

// TinyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("1-p")
//   }, 1000)
// }).then(res => {
//   console.log(res)
//   throw new Error("Asdas")
//   return "2-promise"
// }).then(res => {
//   console.log(res)
// }, err => {
//   console.log(err)
//   return 1
// }).then(res => {
//   console.log(res)
// })

let a = new TinyPromise((resolve, reject) => {
  resolve(1)
})

a.then(res => {
  console.log(1)
  throw new Error(123)
}).catch(err => {
  console.log(err)
})

a.then(res => {
  console.log(2)
  return 2
}).then(res=> {
  console.log(res)  
  },err => {
  console.log(err)
}).then(res => {
  console.log(res)
})