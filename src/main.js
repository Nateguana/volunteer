import './app.scss'
import App from './App.svelte'

console.log("Page Loaded");

function sendError(error) {
  let obj = error;
  fetch("/test", {
    method: "POST",
    body: JSON.stringify(obj, Object.getOwnPropertyNames(obj)),
    headers: {
      "Content-Type": "application/json",
    },
  })
}

try {
  //console.log(Object.keys())
  fetch("/test", {
    method: "GET",
    signal: AbortSignal.timeout(5000),
  })
    .then((res) => {
      console.log("sent!");
    }).catch((err) => {
      console.log("did not send!");
      console.log(err);
    });
} catch (e) {
  console.log("error moment")
  console.log(e)
  sendError(e)
}

console.log("got through try catch");

const app = new App({
  target: document.body,
});



export default app
