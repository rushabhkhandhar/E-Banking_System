// Simple test without imports
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    const root = document.getElementById('root');
    if (root) {
        root.innerHTML = `
            <div style="padding: 20px; font-family: Arial, sans-serif;">
                <h1 style="color: #117A8B;">E-Banking System</h1>
                <p>Pure JavaScript test - no React!</p>
                <button onclick="alert('Working!')">Click me</button>
            </div>
        `;
        console.log('Content added to root');
    } else {
        console.error('Root element not found');
    }
});
