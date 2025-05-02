document.addEventListener("DOMContentLoaded", function() {
  const includes = document.querySelectorAll("include");
  
  // Function to load each <include> sequentially
  const loadIncludesSequentially = async () => {
    for (let element of includes) {
      const src = element.getAttribute('src');
      if (!src) {
        console.warn('Include tag missing src attribute', element);
        continue;
      }
      
      try {
        const content = await loadInclude(`${src}.html`);
        element.insertAdjacentHTML("afterend", content);
        element.remove();
      } catch (error) {
        console.error(`Error loading include ${src}:`, error);
        element.style.display = 'none';
      }
    }
  };
  
  loadIncludesSequentially();
  
  // Function to load the content of each include tag
  async function loadInclude(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  }
});

// PWA রেজিস্ট্রেশন
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful');
      })
      .catch((err) => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

// অফলাইন ডিটেকশন
window.addEventListener('online', () => {
  document.querySelector('.offline-alert').classList.add('hidden')
});

window.addEventListener('offline', () => {
  document.querySelector('.offline-alert').classList.remove('hidden')
});

// ইন্সটল প্রম্পট
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  const installBtn = document.querySelector('.install-btn');
  installBtn.style.display = 'block';
  
  installBtn.addEventListener('click', () => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted install prompt');
      }
      deferredPrompt = null;
    });
  });
});
