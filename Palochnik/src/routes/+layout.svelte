<script>
  import favicon from '$lib/assets/favicon.svg'

  let { children } = $props()
</script>

<svelte:head>
  <link
    rel="icon"
    type="image/svg+xml"
    href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%2338bdf8'/><g stroke='%230f172a' stroke-width='2' stroke-linecap='round' fill='none'><circle cx='16' cy='10' r='3'/><line x1='16' y1='13' x2='16' y2='22'/><path d='M10 17 L16 15 L22 17'/><line x1='16' y1='13' x2='12' y2='28'/><line x1='16' y1='22' x2='20' y2='28'/></g></svg>"
  />
</svelte:head>

{@render children()}
