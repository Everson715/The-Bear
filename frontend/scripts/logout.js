
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('bearToken');
      localStorage.removeItem('bearUser');
      window.location.href = 'login.html';
    });
  }
});
