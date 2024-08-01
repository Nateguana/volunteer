<script>
    export let mode;
    export let signOut;
    export let center = false;
</script>

<header class="full-width header">
    <span class="width"
        ><button on:click={signOut} class="button">Sign Out</button></span
    >
    <span>{mode.name}</span>
</header>
<div class="column" class:center>
    <slot />
</div>

<style>
    .column {
        width: 100%;
        display: flex;
        flex-grow: 1;
        place-items: center;
        flex-direction: column;
    }
    .center {
        justify-content: center;
    }
    .header {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        place-items: center;
    }
    .width {
        width: 100%;
    }
    .button {
        padding: 1vw;
    }
</style>
