<script>
  import PromiseLoader from "../lib/PromiseLoader.svelte";

  export let mode;

  let first = true;
  let promise = Promise.reject();

  function tryPasword(password) {
    first = false;
    // @ts-ignore
    promise = fetch("/signin", {
      method: "POST",
      body: JSON.stringify({ pass: password }),
      signal: AbortSignal.timeout(5000),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return Promise.reject();
        }
      })
      .then((json) => {
        mode.change("admin_menu", { name: json.name });
      });
  }
  function tryEnter(e) {
    if (e.key === "Enter") {
      tryPasword(e.target.value);
    }
  }
</script>

<PromiseLoader {promise}>
  {#if first}
    <h1>You are not Authenticated</h1>
    <h3>Please enter Password</h3>
  {:else}
    <h1>You could not be Authenticated</h1>
    <h3>Please enter correct Password</h3>
  {/if}
  <input type="text" on:keydown={tryEnter} />
</PromiseLoader>
