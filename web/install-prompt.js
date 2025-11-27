// Install Prompt Handler for PWA
// Handles the "Add to Home Screen" prompt

let deferredPrompt;
let installButton = null;

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt event fired');
  // Prevent the mini-infobar from appearing
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show install button or banner
  showInstallPrompt();
});

// Show install prompt UI
function showInstallPrompt() {
  // Create install banner if it doesn't exist
  if (document.getElementById('pwa-install-banner')) {
    return;
  }

  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #18743c 0%, #145a2f 100%);
    color: white;
    padding: 16px;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  banner.innerHTML = `
    <div style="flex: 1;">
      <div style="font-weight: 600; margin-bottom: 4px; font-size: 14px;">
        Install eConfirm App
      </div>
      <div style="font-size: 12px; opacity: 0.9;">
        Get quick access and a better experience
      </div>
    </div>
    <button id="pwa-install-button" style="
      background: white;
      color: #18743c;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      white-space: nowrap;
    ">Install</button>
    <button id="pwa-dismiss-button" style="
      background: transparent;
      color: white;
      border: none;
      padding: 8px;
      cursor: pointer;
      font-size: 20px;
      opacity: 0.8;
    ">×</button>
  `;

  document.body.appendChild(banner);

  // Install button handler
  document.getElementById('pwa-install-button').addEventListener('click', async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    
    // Clear the deferredPrompt
    deferredPrompt = null;
    
    // Hide the banner
    hideInstallPrompt();
  });

  // Dismiss button handler
  document.getElementById('pwa-dismiss-button').addEventListener('click', () => {
    hideInstallPrompt();
    // Store dismissal in localStorage
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  });

  // Check if user previously dismissed
  const dismissed = localStorage.getItem('pwa-install-dismissed');
  if (dismissed) {
    const dismissedTime = parseInt(dismissed);
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
    // Show again after 7 days
    if (daysSinceDismissed < 7) {
      hideInstallPrompt();
    }
  }
}

// Hide install prompt
function hideInstallPrompt() {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) {
    banner.style.transition = 'transform 0.3s ease-out';
    banner.style.transform = 'translateY(100%)';
    setTimeout(() => {
      banner.remove();
    }, 300);
  }
}

// Listen for app installed event
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  deferredPrompt = null;
  hideInstallPrompt();
  // Show success message
  showInstallSuccess();
});

// Show install success message
function showInstallSuccess() {
  const message = document.createElement('div');
  message.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #10b981;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10001;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-weight: 500;
    animation: slideDown 0.3s ease-out;
  `;
  message.textContent = '✓ App installed successfully!';
  document.body.appendChild(message);

  setTimeout(() => {
    message.style.transition = 'opacity 0.3s ease-out';
    message.style.opacity = '0';
    setTimeout(() => message.remove(), 300);
  }, 3000);
}

// Check if app is already installed
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('App is running in standalone mode');
}

