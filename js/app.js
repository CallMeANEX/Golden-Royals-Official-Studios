// Sidebar toggle logic
const sidebarItems = document.querySelectorAll('.sidebar nav li');
const panels = document.querySelectorAll('.panel');

sidebarItems.forEach(item => {
  item.addEventListener('click', () => {
    sidebarItems.forEach(i => i.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    item.classList.add('active');
    document.getElementById('panel-' + item.dataset.panel).classList.add('active');
  });
});

// Chatbox handlers
document.getElementById('chat-send').addEventListener('click', async () => {
  const input = document.getElementById('chat-input');
  const windowEl = document.querySelector('.chat-window');
  const userMsg = input.value.trim();
  if (!userMsg) return;

  windowEl.innerHTML += `<div class="msg user">${userMsg}</div>`;
  input.value = '';
  // stub: replace with real API call
  const botReply = await fakeApiCall('chat', userMsg);
  windowEl.innerHTML += `<div class="msg bot">${botReply}</div>`;
  windowEl.scrollTop = windowEl.scrollHeight;
});

// Image & Art Lab handlers
document.getElementById('art-generate').addEventListener('click', async () => {
  const prompt = document.getElementById('art-prompt').value.trim();
  if (!prompt) return;
  const container = document.querySelector('.art-output');
  container.innerHTML = 'Generating…';
  const imageUrl = await fakeApiCall('generateImage', prompt);
  container.innerHTML = `<img src="${imageUrl}" alt="Generated Art" />`;
});

// Blender Helper handlers
document.getElementById('blender-generate').addEventListener('click', async () => {
  const imgUrl = document.getElementById('blender-image-url').value.trim();
  if (!imgUrl) return;
  const canvasEl = document.getElementById('model-canvas');
  canvasEl.textContent = 'Preparing 3D model…';
  const modelData = await fakeApiCall('make3DModel', imgUrl);
  // TODO: initialize Three.js or your 3D engine with modelData
  canvasEl.textContent = '3D Model ready (see console)';
  console.log('3D Model data:', modelData);
});

// Settings handlers
document.getElementById('save-settings').addEventListener('click', () => {
  const apiKey = document.getElementById('api-key').value;
  const theme = document.getElementById('theme-select').value;
  localStorage.setItem('AI_API_KEY', apiKey);
  document.body.setAttribute('data-theme', theme);
  alert('Settings saved');
});

// Remove fakeApiCall entirely and add:

async function callChatAPI(message) {
  const res = await fetch('http://localhost:4000/api/chat', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ message })
  });
  return res.json().then(r => r.reply);
}

async function callImageAPI(prompt) {
  const res = await fetch('http://localhost:4000/api/image', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ prompt })
  });
  return res.json().then(r => r.imageUrl);
}

async function callModelAPI(imageUrl) {
  const res = await fetch('http://localhost:4000/api/model', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ imageUrl })
  });
  return res.json().then(r => r.model);
}

// Then update handlers:

// Chat
document.getElementById('chat-send').addEventListener('click', async () => {
  /* ... */
  const botReply = await callChatAPI(userMsg);
  /* ... */
});

// Image
document.getElementById('art-generate').addEventListener('click', async () => {
  /* ... */
  const imageUrl = await callImageAPI(prompt);
  /* ... */
});

// Blender Helper
document.getElementById('blender-generate').addEventListener('click', async () => {
  /* ... */
  const modelData = await callModelAPI(imgUrl);
  // Initialize Three.js or GLTFLoader here:
  loadGLTFModel(modelData.gltf_url || modelData[0]);
});
