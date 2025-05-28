
//LOGIN

const formLogin = document.querySelector('#form-login')

//imput register
const usuario = document.querySelector('#impUser')
const senha = document.querySelector('#impSenha')
const email = document.querySelector('#impEmail')






async function register() {
    if (usuario.value !== "" && senha.value !== "" && email.value !== "") {

        const registerUser = {
            usuario: usuario.value,
            senha: senha.value,
            email: email.value
        }

        try {
            const responseUser = await fetch("https://orcamento-api-node.vercel.app/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(registerUser)
            })

            alert('Usuário Cadastrado com sucesso')

        } catch (error) {
            console.error(error)
        }

    }

    usuario.value = ""
    email.value = ""
    senha.value = ""
}

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault()
    const userLogin = document.querySelector('#impUser');
    const passwordLogin = document.querySelector('#impPassword');

    const respLogin = await fetch('https://orcamento-api-node.vercel.app/user/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario: userLogin.value,
            senha: passwordLogin.value
        })
    })

    const loginData = await respLogin.json()

    if (respLogin.ok) {
        alert(`Bem vindo ${userLogin.value}!`)
        window.location.href = '/orcamentos.html'
    } else {
        alert(loginData.message || "Erro ao efetuar o login")
    }

    userLogin.value = ""
    passwordLogin.value = ""
})





