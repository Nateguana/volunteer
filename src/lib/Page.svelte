<script>
    export let mode;
    export let center = false;

    let signout_counter = 0;

    function mousedown() {
        signout_counter += 1;
        setTimeout(() => {
            trySignOut(signout_counter);
        }, 3000);
    }
    function mouseup() {
        // invalidate number
        signout_counter += 1;
    }
    function trySignOut(num) {
        if (signout_counter == num) {
            //mode.change("signout");
            console.log("signout activated")
        }
    }
</script>

<header class="full-width header">
    <span class="width"
        ><button on:mousedown={mousedown} on:mouseup={mouseup} class="button"
            >Sign Out</button
        ></span
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
