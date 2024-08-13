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

    function capitalize(str) {
        return str[0].toUpperCase() + str.slice(1);
    }
    function mapPeople(ele) {
        let dob = ele.dob;
        let date = new Date(ele.last_seen);
        return {
            dob: `${dob.month}/${dob.day}/${dob.year}`,
            first: capitalize(ele.first),
            last: capitalize(ele.last),
            last_seen: `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`,
            zip: (ele.zip + "").padStart(5, "0"),
        };
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
        })
            .then((res) => {
                if (res.status == 200) {
                    return res.json();
                } else {
                    return Promise.reject();
                }
            })
            .then((json) => json.map(mapPeople));
    }
</script>

<PromiseLoader {promise}>
    <Page {mode}>
        <div class="grid3 input">
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
            <div class="grid5">
                <span>Birthday</span>
                <span>First Name</span>
                <span>Last Name</span>
                <span>Last Seen</span>
                <span>Zip Code</span>
            </div>
            {#each results as ele}
                <button class="full-width">
                    <div class="grid5">
                        <span>{ele.dob}</span>
                        <span>{ele.first}</span>
                        <span>{ele.last}</span>
                        <span>{ele.last_seen}</span>
                        <span>{ele.zip}</span>
                    </div>
                </button>
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
    .grid3,
    .grid5 {
        width: 100%;
        display: grid;
        place-items: center;
    }
    .grid3 {
        grid-template-columns: repeat(3, 1fr);
    }
    .grid5 {
        grid-template-columns: repeat(6, 1fr);
        font-size: 1.25em;
    }
    .input {
        grid-template-rows: repeat(2, 1fr);
        height: 3em;
        background-color: var(--slate);
        font-size: 1.125em;
        text-align: center;
    }
    .grid5 :nth-child(-1n + 3) {
        grid-column: span 2;
    }
    .grid5 :nth-last-child(2) {
        grid-row-start: 2;
        grid-column: 2 / span 2;
    }
    .grid5 :nth-last-child(1) {
        grid-row-start: 2;
        grid-column: 4 / span 2;
    }
    input {
        width: 6em;
    }
    /* .w {
        width: 100%;
    } */
</style>
