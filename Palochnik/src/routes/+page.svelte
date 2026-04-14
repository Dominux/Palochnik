<script>
  import { passwordVault } from '$lib/passwordvault.svelte'

  // Svelte 5 syntax
  let mode = $state('encode')
  let file = $state(null)
  let processing = $state(false)
  let isDragging = $state(false)
  let showPassword = $state(false)

  const setMode = (val) => (mode = val)

  // 1. Handle selection via Click/File Picker
  function handleFileSelect(e) {
    if (e.target.files.length > 0) {
      file = e.target.files[0]
    }
  }

  // 2. Handle Drag Over (Necessary to allow dropping)
  function handleDragOver(e) {
    e.preventDefault()
    isDragging = true
  }

  function handleDragLeave() {
    isDragging = false
  }

  // 3. Handle the actual Drop
  function handleDrop(e) {
    e.preventDefault()
    isDragging = false

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      file = e.dataTransfer.files[0]
      // Optional: auto-switch mode if it's an .enc file
      if (file.name.endsWith('.enc')) mode = 'decode'
    }
  }

  // Configuration for security
  const ALGO = 'AES-GCM'
  const SALT = new TextEncoder().encode("static-salt-change-this-ebal-mat'") // In a real app, use a random salt per file

  async function deriveKey(pass, usage) {
    const enc = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(pass),
      'PBKDF2',
      false,
      ['deriveKey'],
    )
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: SALT, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: ALGO, length: 256 },
      false,
      [usage],
    )
  }

  async function handleAction() {
    if (!file || !passwordVault.value)
      return alert('Please select a file and enter a password')
    processing = true

    try {
      const fileData = await file.arrayBuffer()

      if (mode === 'encode') {
        const key = await deriveKey(passwordVault.value, 'encrypt')
        const iv = crypto.getRandomValues(new Uint8Array(12)) // 12 bytes is standard for GCM
        const encrypted = await crypto.subtle.encrypt(
          { name: ALGO, iv },
          key,
          fileData,
        )

        // Bundle: [IV (12 bytes)] + [Encrypted Content]
        const blob = new Blob([iv, encrypted], {
          type: 'application/octet-stream',
        })
        download(blob, file.name + '.enc')
      } else {
        const key = await deriveKey(passwordVault.value, 'decrypt')
        const iv = fileData.slice(0, 12)
        const data = fileData.slice(12)

        const decrypted = await crypto.subtle.decrypt(
          { name: ALGO, iv: new Uint8Array(iv) },
          key,
          data,
        )
        const blob = new Blob([decrypted], { type: 'application/octet-stream' })
        download(blob, file.name.replace('.enc', ''))
      }
    } catch (e) {
      alert('Error: Likely a wrong password or corrupted file.')
    } finally {
      processing = false
    }
  }

  const download = (blob, name) => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = name
    a.click()
  }
</script>

<main class="glass-card">
  <h2>Palochnik</h2>
  <div class="tabs">
    <button
      type="button"
      class={mode === 'encode' ? 'active' : ''}
      onclick={() => setMode('encode')}
    >
      Lock
    </button>

    <button
      type="button"
      class={mode === 'decode' ? 'active' : ''}
      onclick={() => setMode('decode')}
    >
      Unlock
    </button>
  </div>

  <div class="ui-body">
    <div
      class="dropzone {isDragging ? 'dragging' : ''}"
      ondragover={handleDragOver}
      ondragleave={handleDragLeave}
      ondrop={handleDrop}
      onclick={() => document.getElementById('fileInput').click()}
    >
      <input id="fileInput" type="file" onchange={handleFileSelect} hidden />

      {#if file}
        <div class="file-ready">
          <span class="icon">📄</span>
          <p>{file.name}</p>
          <small>{(file.size / 1024).toFixed(1)} KB</small>
        </div>
      {:else}
        <div class="prompt">
          <span class="icon">📥</span>
          <p>Click or Drag & Drop</p>
          <small>Any file to {mode === 'encode' ? 'lock' : 'unlock'}</small>
        </div>
      {/if}
    </div>

    <div class="password-wrapper">
      <input
        type={showPassword ? 'text' : 'password'}
        bind:value={passwordVault.value}
        placeholder="Secret Key"
        class="pass-input"
      />

      <button
        type="button"
        class="eye-btn"
        onclick={() => (showPassword = !showPassword)}
        aria-label="Toggle password visibility"
      >
        <!-- Используем простые эмодзи или иконки -->
        {showPassword ? '👁️' : '🙈'}
      </button>
    </div>

    <button class="action-btn" onclick={handleAction} disabled={processing}>
      {processing
        ? 'Working...'
        : mode === 'encode'
          ? 'Encrypt File'
          : 'Decrypt File'}
    </button>
  </div>
</main>

<style>
  :global(body) {
    background: #0f172a;
    color: white;
    font-family: sans-serif;
    display: grid;
    place-items: center;
    height: 100vh;
    margin: 0;
  }
  .glass-card {
    background: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 24px;
    width: 320px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }
  .tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
  }
  /* 1. General Button Style */
  .tabs button {
    flex: 1;
    padding: 10px;
    border-radius: 12px;
    border: none;
    background: rgba(255, 255, 255, 0.05);
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  /* 2. The Active State (Higher Specificity) */
  .tabs button.active {
    background-color: #38bdf8 !important;
    color: #0f172a !important;
    font-weight: bold !important;
    opacity: 1 !important;
  }

  /* 3. Ensure hover doesn't override active */
  .tabs button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  .dropzone {
    border: 2px dashed rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: rgba(255, 255, 255, 0.03);
    margin-bottom: 20px;
  }

  .dropzone:hover,
  .dropzone.dragging {
    background: rgba(56, 189, 248, 0.1);
    border-color: #38bdf8;
  }

  .dragging {
    transform: scale(1.02);
  }

  .icon {
    font-size: 2rem;
    display: block;
    margin-bottom: 10px;
  }
  p {
    margin: 5px 0;
    font-weight: 500;
  }
  small {
    color: #94a3b8;
  }

  .file-ready p {
    color: #38bdf8;
  }
  .file-info {
    font-size: 0.9rem;
    color: #94a3b8;
    word-break: break-all;
  }
  .password-wrapper {
    position: relative;
    width: 100%;
    margin-bottom: 20px;
  }

  .pass-input {
    width: 100%;
    padding: 12px;
    padding-right: 45px; /* Место для кнопки */
    border-radius: 12px;
    border: 1px solid #334155;
    background: #1e293b;
    color: white;
    box-sizing: border-box;
  }

  .eye-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: grayscale(1); /* Чтобы эмодзи не были слишком яркими */
    transition: transform 0.1s;
  }

  .eye-btn:active {
    transform: translateY(-50%) scale(0.9);
  }
  .action-btn {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: #38bdf8;
    color: #0f172a;
    font-weight: bold;
    cursor: pointer;
  }
  .action-btn:disabled {
    opacity: 0.5;
  }
</style>
