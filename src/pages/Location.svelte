<script lang="ts">
    import Page from "../lib/Page.svelte";
    export let mode;
    function LOC(name, code) {
        return { name, code };
    }
    const LOCATIONS = [
        LOC("Dartmouth", "DM"),
        LOC("Fall River", "FR"),
        LOC("New Bedford", "NB"),
        LOC("Swansea", "SS"),
        LOC("Wareham", "WH"),
    ];
    function select(loc) {
        mode.change("search", { loc });
    }
</script>

<div class="grid">
    {#each LOCATIONS as loc}
        <button on:click={() => select(loc)}>{loc.name}</button>
    {/each}
</div>

<style>
    .grid {
        grid-template-columns: 1fr 1fr;
        width: 75svw;
        height: 75svh;
    }
</style>
