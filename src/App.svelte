<script>
    import Start from "./pages/Start.svelte";
    import NotAuth from "./pages/NotAuth.svelte";
    import AdminMenu from "./pages/AdminMenu.svelte";
    import Search from "./pages/Search.svelte";

    let mode = {
        change(new_page, name = "") {
            if (name) {
                mode.name = name;
            }
            mode.page = new_page;
        },
        page: "",
        name: "",
    };
</script>

{#if mode.page == ""}
    <Start {mode} />
{:else if mode.page == "not_auth"}
    <NotAuth {mode} />
{:else if mode.page == "admin_menu"}
    <AdminMenu {mode} />
{:else if mode.page == "search"}
    <Search {mode} />
{:else}
    <h1>Unknown</h1>
{/if}
