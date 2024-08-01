<script>
    import Spinner from "./Spinner.svelte";
    export let promise;
    export let dim = [0.5, 0.5];
</script>

{#await promise}
    <Spinner {dim} />
{:then _}
    <h1>You are being redirected</h1>
{:catch}
    <slot />
{/await}
