function autenticar(){
    // RECUPERA DIGITAÇÃO
    var txtEmail = document.getElementById("txtEmail").value;
    var txtSenha = document.getElementById("txtSenha").value;

    // EXIBIR NO CONSOLE
    console.log("Digitou = "+txtEmail+" / "+txtSenha);

    // ALGUNS PASSOS
    // MENSAGEM DO CORPO
    var func=0;
    if(! isNaN(txtEmail)){
        func = parseInt(txtEmail);
    }

    //mensagem do corpo
    var msgBody = {
        email     : txtEmail,
        racf      : txtEmail,
        funcional : func,
        senha     : txtSenha
    }

    // FORMATO DA MENSAGEM DO CABECALHO
    var cabecalho = {
        method : "POST",
        body   : JSON.stringify(msgBody), //converter msgBody para STRING JSON
        headers : {
            "Content-type":"application/json"
        }
    }

    // agora sim posso enviar os dados
    // LANCAMOS RESPOSTA AO BACKEND. COM O RESULTADO, TRATAMOS NA FUNCAO DE RESPOSTA
    
    fetch("http://localhost:8088/login", cabecalho)
        .then(res => trataResposta(res))
}

function trataResposta(res){
    if (res.status==200){
        //document.getElementById("msgERRO").innerHTML = "<h3>Conectado com sucesso!<h3>"
        res.json().then(objeto => logar(objeto))
    }
    else if (res.status==401){
        document.getElementById("msgERRO").innerHTML = "<h3>Senha Inválida!<h3>"
    }
    else if (res.status==404){
        document.getElementById("msgERRO").innerHTML = "<h3>Usuário Desconhecido!<h3>"
    }
}

function logar(objeto){
    //console.log(objeto);
    //AGORA VAMOS ARMAZENAR O OBJETO LINK NO ARMAZENAMENTO INTERNO DO BROWSER (LOCAL STORAGE)
    var objSTR = JSON.stringify(objeto);
    localStorage.setItem("ScheduleUSER",objSTR);
    window.location = "home.html";
}