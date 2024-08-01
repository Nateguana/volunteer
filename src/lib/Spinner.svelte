<script>
    import { Circle } from "svelte-loading-spinners";
    export let dim = [0.5, 0.5];
    let size = Math.min(
        document.body.clientWidth * dim[0],
        document.body.clientHeight * dim[1],
    );
</script>

<Circle {size} color="Silver" duration="1s"></Circle>
