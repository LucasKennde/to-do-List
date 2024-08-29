

let usuarios = JSON.parse(localStorage.getItem('usuarios')) || []
let tasks = JSON.parse(localStorage.getItem('tasks')) || []

const userLogado = JSON.parse(localStorage.getItem('logado'))

const conteudoSite = document.getElementById('conteudoSite')

if(userLogado){
    displayTodoList()
    
}else{
    displayLogin()
}


function displayTodoList(){

    const userLogado = JSON.parse(localStorage.getItem('logado')) || []
    const primeiroNome = userLogado.nome.split(' ');
    console.log(primeiroNome)
    conteudoSite.innerHTML = `
    <section>
            <div>  
                <header id='headerTasks'><h1 id="title">Olá, ${primeiroNome[0]}</h1> <button   onclick="logout()">Logout</button></header>

                <div id="tasks">

                </div>
                <div id="tasksConcluidas"></div>
            </div>
            <div id="inputTasks">
                <input type="text" id='task' placeholder="Adicionar Tarefa"><button onclick="cadastrarTask()">Enviar</button>
            </div>
            
    </section>`
    atualizarTasks()

}

function displayCadastrar(){
    conteudoSite.innerHTML = `
    <div id="containerForm">
            <h1>Cadastro</h1>
            <div>
                <label for="senha">Nome:</label>
                <input type="text" name="nome" id="nome">
                <div class='message'></div>
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="text" name="email" id="email">
                <div class='message'></div>
            </div>
            <div>
                <label for="senha">Senha:</label>
                <input type="password" name="senha" id="senha">
                <div class='message'></div>
            </div>
            <div>
                <label for="confSenha">Confirme a senha:</label>
                <input type="password" name="confSenha" id="confSenha">
            </div>
            <button class='btn-ok' onclick="cadastrarUsuario()">Cadastrar</button>
            <button class='btn-default'onclick="displayLogin()">Voltar</button>
        </div>
    `
}

function displayLogin(){
    conteudoSite.innerHTML = `
    <div id="containerForm">
            <h1>Login</h1>
            
            <div>
                <label for="email">Email:</label>
                <input type="text" name="email" id="email">
            </div>
            <div>
                <label for="senha">Senha:</label>
                <input type="password" name="senha" id="senha">
            </div>
            
            <button class='btn-ok' onclick="logar()">Logar</button>
            <button class='btn-default' onclick="displayCadastrar()">Cadastre-se</button>
        </div>
    `
}



function shakeForm() {
    document.getElementById('containerForm').classList.add('shake');
    setTimeout(() => {
        document.getElementById('containerForm').classList.remove('shake');
    }, 820);
}

function setError(input, message){
    const formGroup = input.parentElement;
    const errorDisplay = formGroup.querySelector('.message');
    errorDisplay.innerText = message;
    shakeForm()
    errorDisplay.classList.add('error');
    errorDisplay.classList.remove('success');
}



function gerarIdUnico() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function cadastrarTask(){
    const userLogado = JSON.parse(localStorage.getItem('logado'))
    const task = document.getElementById('task')
    
    const taskValue = task.value
    if(taskValue == ''){
        alert('Preencha o campo de tarefa')
        return
    }
    const newTask = {
        id: gerarIdUnico(),
        task: taskValue,
        status:'Pendente',
        dataCriacao: new Date(),
        dataConclusao: null,
        id_user:userLogado.id
    }
    tasks.push(newTask)
    localStorage.setItem('tasks', JSON.stringify(tasks));
    task.value = ''
    atualizarTasks()
    
}

function atualizarTasks(){
    const userLogado = JSON.parse(localStorage.getItem('logado'))
    let tasksUser = tasks.filter(tasks => tasks.id_user == userLogado.id && tasks.status == 'Pendente')
    let tasksUserConcluidas = tasks.filter(tasks => tasks.id_user == userLogado.id  && tasks.status == 'Concluída')

    const divTasks = document.getElementById('tasks')
    const divTasksConcluidas = document.getElementById('tasksConcluidas')

    divTasks.innerHTML = "";
    divTasksConcluidas.innerHTML = "";

    const tasksHTMLConcluidas = tasksUserConcluidas.map((taskConcluida)=>{
        return `<div>
        <p>${taskConcluida.task}</p>
        </div>`
    })
   

    const tasksHTML = tasksUser.map((task) => {
        return `<div>
        <span>${task.task}</span>
        <button class='btn-ok' onclick="concluirTask('${task.id}')">
        Concluir
        </button>
        <button class='btn-warn' onclick="deletarTask('${task.id}')">
        Deletar
        </button></div>`
        })

        divTasks.innerHTML = tasksHTML.join('')
        divTasksConcluidas.innerHTML = `<span id='concluidos'><h3>Concluídos</h3>${tasksHTMLConcluidas.join('')}</span>`
}

function concluirTask(id){
    const task = tasks.find(task => task.id == id)
    task.status = 'Concluída'
    localStorage.setItem('tasks', JSON.stringify(tasks))
    atualizarTasks()


}

function deletarTask(id){
    tasks = tasks.filter(task => task.id !== id)
    localStorage.setItem('tasks', JSON.stringify(tasks));
    atualizarTasks()
}

function verificarNovoUsuario(email){
    const validacaoUser = usuarios.find(user => user.email === email);
    if(validacaoUser){
        return false
    }
    return true
}

function verificarInput(input){
    if(input.value ==''){
        setError(input, 'Esse campo é obrigatorio') 
        return true
    }
    return false
}

function validateEmail(email) {
    const emailValue = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue === '') {
        setError(email, 'O e-mail é obrigatório');
        return false;
    } else if (!emailRegex.test(emailValue)) {
        setError(email, 'Digite um e-mail válido');
        return false;
    } else {
        return true;
    }
}

function validateSenha(senha) {
    const senhaValue = senha.value.trim();
    const regexSenha = /(?=.*[$*&@#!])(?=.*[A-Z])(?=.*[a-z]).*$/
    
    
    if (senhaValue === '') {
        setError(senha, 'A senha é obrigatória');
        return false;
    } else if (senhaValue.length < 6) {
        setError(senha, 'A senha deve ter pelo menos 6 caracteres');
        return false;
    } else if(!regexSenha.test(senhaValue)){
       setError(senha, 'A senha precisa ter letras maiusculas e minusculas e caracteres especiais');
       return false;   
    } else {
        
        return true;
    }
}
function cadastrarUsuario(){
    const nome = document.getElementById('nome')
    const email = document.getElementById('email')
    const senha = document.getElementById('senha')
    const confSenha = document.getElementById('confSenha')
    
    if(!validateEmail(email)){
        setError(email,'E-mail invalido')
        return
    } 
    if(!validateSenha(senha)){
        setError(senha,'Senha  invalida')

        return
    } 
    if(!verificarNovoUsuario(email.value)){
        setError(email, 'Email já cadastrado')
        return
    }
    if(verificarInput(nome)) return 
    if(verificarInput(email)) return 
    if(verificarInput(senha)) return 
    if(verificarInput(confSenha)) return 
    
    if(senha.value !== confSenha.value){
        setError(senha, 'As senhas não conferem')
        return
    }
    const newUser = {
        id: gerarIdUnico(),
        nome:nome.value,
        email:email.value,
        senha:senha.value
    }
    
    usuarios.push(newUser)
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('Usuario cadastrado com sucesso')
    nome.value = ''
    email.value = ''
    senha.value = ''
    confSenha.value = ''
    displayLogin()

}

function logar(){
    const email = document.getElementById('email')
    const senha = document.getElementById('senha')


    if(!validateEmail(email)){
        setError(email,'E-mail invalido')
        return
    } 
    
    if(!validateSenha(senha)){
        setError(senha,'Senha  invalida')

        return
    } 
    
    
    if(verificarInput(email)) return 
    if(verificarInput(senha)) return 
    
    

    const validacaoUser = usuarios.find(user => user.email === email.value && user.senha ===
        senha.value);
        if(validacaoUser){
            alert('Logado com sucesso')
            localStorage.setItem('logado',JSON.stringify(validacaoUser))
            displayTodoList()
        }else{
            alert('Email ou senha incorretos')
        }
                
}

function logout(){
    localStorage.removeItem("logado");
    displayLogin()
}




