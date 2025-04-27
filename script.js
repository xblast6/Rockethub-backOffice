const formLogin = document.getElementById("formLogin")
const inpEmail = document.getElementById("inpEmail")
const inpPassoword = document.getElementById("inpPassword")
const btnLogin = document.getElementById("btnLogin")

formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    
    try {
      const response = await fetch('https://rockethub.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      console.log("Response:", response);
      const data = await response.json();
      console.log("Data ricevuta:", data);
      if (response.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        window.location.href = 'agg_company.html';
      } 
      else {
        alert(data.message || 'Errore di login, controlla le credenziali');
      }
    } catch (error) {
      console.error('Errore nella richiesta:', error);
      alert('Si è verificato un errore durante la richiesta di login.');
    }
})
