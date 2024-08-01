<script lang="ts">
    import Page from "../lib/Page.svelte";
    import PromiseLoader from "../lib/PromiseLoader.svelte";
    import DateInput from "../lib/DateInput.svelte";
    import Spinner from "../lib/Spinner.svelte";
    export let mode;

    let promise = Promise.reject();
    let results_promise = Promise.resolve([]);
    //let searchAbort = new AbortController();

    var searchData = { dob: {}, first: "", last: "" };
    //let results = [];

    let first = true;

    function signOut() {
        console.log("sign out");
    }
    function search() {
        first = false;
        // searchAbort.abort();
        // searchAbort = new AbortController();

        let signal = //AbortSignal.any([
            //     searchAbort.signal,
            AbortSignal.timeout(5000);
        // ]);

        // @ts-ignore
        results_promise = fetch("/search", {
            method: "POST",
            body: JSON.stringify(searchData),
            signal,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return Promise.reject();
            }
        });
        // .then((json) => {
        //     results = json;
        // });
    }
</script>

<PromiseLoader {promise}>
    <Page {mode} {signOut}>
        <div class="grid input">
            <span>Birthday</span>
            <span>First Name</span>
            <span>Last Name</span>
            <DateInput bind:value={searchData.dob}></DateInput>
            <input
                type="text"
                autocomplete="off"
                bind:value={searchData.first}
            />
            <input
                type="text"
                autocomplete="off"
                bind:value={searchData.last}
            />
        </div>
        <button class="full-width" on:click={search}>
            <h2>Search</h2>
        </button>
        {#await results_promise}
            <Spinner dim={[0.5, 0.75 / 2]} />
        {:then results}
            <div class="grid">
                <span>Birthday</span>
                <span>First Name</span>
                <span>Last Name</span>
            </div>
            {#each results as ele}
                <div class="grid">
                    <span>{ele.dob.month}/{ele.dob.day}/{ele.dob.year}</span>
                    <span>{ele.name.first}</span>
                    <span>{ele.name.last}</span>
                </div>
            {:else}
                <div class="full width">
                    <h2>
                        {#if first}
                            Press the search button to search
                        {:else}
                            No people found
                        {/if}
                    </h2>
                </div>
            {/each}
        {:catch}
            <h2>Something went wrong</h2>
        {/await}
    </Page>
</PromiseLoader>

<style>
    .grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        place-items: center;
    }
    .input {
        grid-template-rows: repeat(2, 1fr);
        height: 3em;
        background-color: var(--slate);
        font-size: 1.125em;
        text-align: center;
    }
    input {
        width: 6em;
    }
    /* .w {
        width: 100%;
    } */
</style>
