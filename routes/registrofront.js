const form = document.getElementById('registroForm');

form.addEventListener('submit', async (event) =>{
    event.preventDefault();
    const formData = new FormData(form);
    const requestData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('https://leeresmipasion.com:1026/registro', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        if(!response.ok){
            console.log("vamos por acá");
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        alert('Usuario registrado correctamente');
        //form.restet();
        window.location.href = '../public/welcome.html';
        /*const validarToken = generarToken();
        
        function generarToken(){
            const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const longitudToken = 32;
            let token = '';
            
            for(let i = 0; i < longitudToken; i++){
                const randomIndex = Math.floor(Math.random() * caracteres.length);
                token += caracteres[randomIndex];
            }
            return token;
        }
        
        try{
            const response = await fetch('info@leeresmipasion.com', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: requestData.email,
                    validarToken: validarToken
                })
            });
            if(!response.ok){
                throw new Error('Error al enviar correo');
            }
            alert('Usuario registrado. Verifica tu correo');
        }catch(error){
            console.error('error al enviar correo', error.message);
            alert('error al enviar correo, intenta de nuevo');
        }*/
    }catch (error){
        console.error('Error al registrar usuario', error.message);
        alert('correo electrónico existente');
    }
});