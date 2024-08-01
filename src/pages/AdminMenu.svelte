<script>
    import Page from "../lib/Page.svelte";
    import PromiseLoader from "../lib/PromiseLoader.svelte";
    export let mode;
    let promise = Promise.reject();
    function signOut() {
        console.log("sign out");
    }
    function downgrade() {
        let name = "hehe haha";
        // @ts-ignore
        promise = fetch("/downgrade", {
            method: "POST",
            body: JSON.stringify({ name }),
            signal: AbortSignal.timeout(5000),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res.status == 200) {
                mode.change("search", name);
            } else {
                return Promise.reject();
            }
        });
    }
</script>

<PromiseLoader {promise}>
    <Page {mode} {signOut} center={true}>
        <h1>Admin Menu</h1>
        <div class="menu">
            <button on:click={downgrade}>Downgrade to User</button>
            <button>See results</button>
        </div>
    </Page>
</PromiseLoader>

<style>
    .menu {
        width: 100vw;
        display: flex;
        justify-content: space-around;
    }
    button {
        height: 25vw;
        width: 25vw;
    }
</style>
