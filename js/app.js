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

// Fake API stub
async function fakeApiCall(tool, payload) {
  return new Promise(resolve => {
    setTimeout(() => {
      switch (tool) {
        case 'chat': resolve(`Echo: ${payload}`); break;
        case 'generateImage': resolve('https://via.placeholder.com/512'); break;
        case 'make3DModel': resolve({ vertices: [], faces: [] }); break;
      }
    }, 1000);
  });
}