<div class="container">
  <h2>File Hub</h2>

  <!-- Upload Section -->
  <div
    class="upload-area"
    on:click={document.getElementById('fileInput').click()}
  >
    <p>Drag & drop files here or</p>
    <button class="btn">Browse Files</button>
    <input type="file" id="fileInput" style="display:none" />
  </div>

  <!-- Download Section -->
  <div class="download-section">
    <h3>Ready for Download</h3>
    <ul class="file-list">
      <li class="file-item">
        <span>processed_bits.dat</span>
        <a href="#" class="btn" style="padding: 5px 15px; font-size: 0.8em;"
          >Download</a
        >
      </li>
    </ul>
  </div>
</div>
