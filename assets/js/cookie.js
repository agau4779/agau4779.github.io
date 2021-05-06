const expiry = new Date(new Date().getTime() + 10*60000).toUTCString();
document.cookie = "3p=true; SameSite=None; Secure; expires=" + expiry"; 