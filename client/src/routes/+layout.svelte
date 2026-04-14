<script>
  import { pwaInfo } from 'virtual:pwa-info'

  export const prerender = false
  export const ssr = false

  let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '')
  let { children } = $props()
</script>

<svelte:head>
  {@html webManifestLink}
</svelte:head>

{@render children()}
