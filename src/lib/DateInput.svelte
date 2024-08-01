<script>
    //import dayjs from "dayjs";

    export let value = {};
    const LENGTHS = [2, 2, 4];
    const MIN = [1, 1, 1900];
    const MAX = [12, 31, 2024];

    let div;

    let internal = [0, 0, 0];
    //let editing = [0, 0, 0];

    function change(e, index) {
        let target = e.target;
        // reset if too long
        if (target.value.length > LENGTHS[index]) {
            target.value = e.data.slice(-1);
        }
        // reset if bad character
        if (!/^\d+$/.test(target.value)) {
            target.value = "";
        }

        if (target.value.length == LENGTHS[index]) {
            target.blur();
            if (index < 2) {
                div.children[(index + 1) * 2].focus();
            }
        }

        // year 0 cancel
        if (index == 2 && target.value == "0") {
            target.value = "";
            target.blur();
        }

        let num = parseInt(target.value);
        // NAN is bad
        if (isNaN(num)) {
            num = 0;
        }

        // being out of bounds is bad
        if (num < MIN[index] && num > MAX[index]) {
            num = 0;
        }
        // set internal
        internal[index] = num;

        // date at least needs month and day
        if (internal[0] != 0 || internal[1] != 0) {
            let new_value = {
                month: internal[0],
                day: internal[1],
            };
            if (internal[2] != 0) {
                new_value.year = internal[2];
            }
            value = new_value;
        } else {
            value = {};
        }
    }
</script>

<div bind:this={div}>
    <input
        type="tel"
        pattern="\d*"
        class="c2"
        placeholder="01"
        on:input={(e) => change(e, 0)}
    />
    <span>/</span>
    <input
        type="tel"
        pattern="\d*"
        class="c2"
        placeholder="01"
        on:input={(e) => change(e, 1)}
    />
    <span>/</span>
    <input
        type="tel"
        pattern="\d*"
        class="c4"
        placeholder="1900"
        on:input={(e) => change(e, 2)}
    />
</div>

<style>
    div {
        display: flex;
        background-color: var(--darker);
    }
    .c2 {
        width: 1.5em;
    }
    .c4 {
        width: 2.5em;
    }
</style>
