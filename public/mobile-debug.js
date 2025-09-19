// Mobile Debug Script - Add this to check common issues
console.log('🔍 Mobile Debug Script Loaded');

// Check for common mobile issues
const mobileDebug = {
  checkViewport: () => {
    console.log('📱 Viewport:', {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      orientation: screen.orientation?.type || 'unknown'
    });
  },

  checkTouch: () => {
    console.log('👆 Touch Support:', {
      touchstart: 'ontouchstart' in window,
      touchmove: 'ontouchmove' in window,
      touchend: 'ontouchend' in window,
      maxTouchPoints: navigator.maxTouchPoints || 0
    });
  },

  checkMemory: () => {
    if ('memory' in performance) {
      console.log('🧠 Memory:', performance.memory);
    }
  },

  checkConnection: () => {
    if ('connection' in navigator) {
      console.log('🌐 Connection:', {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      });
    }
  },

  checkErrors: () => {
    window.addEventListener('error', (e) => {
      console.error('🚨 Global Error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('🚨 Unhandled Promise Rejection:', e.reason);
    });
  }
};

// Run all checks
mobileDebug.checkViewport();
mobileDebug.checkTouch();
mobileDebug.checkMemory();
mobileDebug.checkConnection();
mobileDebug.checkErrors();

// Make available globally for manual testing
window.mobileDebug = mobileDebug;