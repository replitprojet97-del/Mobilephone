/**
 * Simple authentication for admin interface
 */

// Simple password check (in production, use proper authentication)
const ADMIN_PASSWORD = 'luxio2025!';

function checkAuthentication() {
    const isAuthenticated = sessionStorage.getItem('luxio_admin_auth') === 'true';
    
    if (!isAuthenticated) {
        showLoginModal();
        return false;
    }
    
    return true;
}

function showLoginModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 2rem;
            width: 400px;
            text-align: center;
        ">
            <h2 style="color: #fcbd01; margin-bottom: 1.5rem;">
                <i class="fas fa-lock"></i> Accès Administration
            </h2>
            <p style="color: #aaa; margin-bottom: 1.5rem;">
                Entrez le mot de passe pour accéder à l'interface d'administration.
            </p>
            <input 
                type="password" 
                id="admin-password" 
                placeholder="Mot de passe"
                style="
                    width: 100%;
                    padding: 0.75rem;
                    background: #2a2a2a;
                    border: 1px solid #444;
                    border-radius: 6px;
                    color: #fff;
                    margin-bottom: 1rem;
                    font-size: 1rem;
                "
            >
            <div style="display: flex; gap: 1rem;">
                <button onclick="attemptLogin()" style="
                    flex: 1;
                    background: #fcbd01;
                    color: #000;
                    border: none;
                    padding: 0.75rem;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                ">
                    Connexion
                </button>
                <button onclick="window.location.href='../index.html'" style="
                    flex: 1;
                    background: none;
                    color: #aaa;
                    border: 1px solid #666;
                    padding: 0.75rem;
                    border-radius: 6px;
                    cursor: pointer;
                ">
                    Annuler
                </button>
            </div>
            <div id="auth-error" style="
                color: #ff3b30;
                margin-top: 1rem;
                display: none;
            "></div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus sur le champ mot de passe
    setTimeout(() => {
        document.getElementById('admin-password').focus();
    }, 100);
    
    // Allow Enter key to submit
    document.getElementById('admin-password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            attemptLogin();
        }
    });
}

function attemptLogin() {
    const password = document.getElementById('admin-password').value;
    const errorDiv = document.getElementById('auth-error');
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('luxio_admin_auth', 'true');
        window.location.reload();
    } else {
        errorDiv.textContent = 'Mot de passe incorrect';
        errorDiv.style.display = 'block';
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-password').focus();
    }
}

function logout() {
    sessionStorage.removeItem('luxio_admin_auth');
    window.location.reload();
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuthentication()) {
        // Hide admin content
        document.querySelector('.admin-container').style.display = 'none';
    } else {
        // Show logout button
        const header = document.querySelector('.admin-header');
        if (header) {
            const logoutBtn = document.createElement('button');
            logoutBtn.textContent = 'Déconnexion';
            logoutBtn.className = 'btn-secondary-admin';
            logoutBtn.style.marginLeft = '1rem';
            logoutBtn.onclick = logout;
            header.appendChild(logoutBtn);
        }
    }
});

// Session timeout (30 minutes)
setInterval(() => {
    const authTime = sessionStorage.getItem('luxio_admin_auth_time');
    if (authTime && Date.now() - parseInt(authTime) > 30 * 60 * 1000) {
        logout();
    }
}, 60000); // Check every minute

// Set auth time on successful login
if (sessionStorage.getItem('luxio_admin_auth') === 'true' && !sessionStorage.getItem('luxio_admin_auth_time')) {
    sessionStorage.setItem('luxio_admin_auth_time', Date.now().toString());
}