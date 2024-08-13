<script>
    import PromiseLoader from "../lib/PromiseLoader.svelte";
    export let mode;
    console.log("trying to connect but will never2");
    let promise = fetch("/connect", {
        method: "POST",
        signal: AbortSignal.timeout(5000),
    })
        .then((res) => {
            console.log("connected!");
            if (res.status === 200) {
                return res.json();
            } else {
                return Promise.reject();
            }
        })
        .then((json) => {
            let name = { name: json.name };
            if (json.user_type === "admin") {
                mode.change("admin_menu", name);
            } else if (json.user_type === "user") {
                mode.change("search", name);
            } else {
                mode.change("not_auth", name);
            }
        })
        .catch((err) => {
            console.log("eroor!");
            console.log(err);
            return Promise.reject();
        });
</script>

<PromiseLoader {promise}>
    <h1>Something went wrong</h1>
</PromiseLoader>
