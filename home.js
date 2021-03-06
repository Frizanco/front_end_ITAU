//acessar LocalStorage e ver se existem um item chamado ScheduleUSER. Se tiver, recupera e preenche as lacunas.
//Se nao tiver, retornar ao index (sinal que nao tem usuario conectado)

var templateFoto = `<img src="{{LINKFOTO}}" width="100%">`;
var templateInfo = `Nome: {{NOME}} <br>
                    Email: {{EMAIL}} <br>
                    RACF: {{RACF}} <br>
                    Funcional: {{FUNCIONAL}} <br>
                    Departamento: {{DEPARTAMENTO}} / {{UNIDADE}}`;

function carregarInfoUsuario(){
    var userSTR = localStorage.getItem("ScheduleUSER");
    if (!userSTR){      //caso alguem forcou o link sem logar
        window.location="index=html";
    }
    else {
        var user = JSON.parse(userSTR);

        document.getElementById("fotoUSER").innerHTML = templateFoto.replace("{{LINKFOTO}}",user.linkFoto);

        var infoUser = templateInfo.replace("{{NOME}}", user.nome)
                                   .replace("{{EMAIL}}", user.email)
                                   .replace("{{RACF}}",  user.racf)        
                                   .replace("{{FUNCIONAL}}", user.funcional)
                                   .replace("{{DEPARTAMENTO}}", user.depto.nome)    
                                   .replace("{{UNIDADE}}", user.depto.unidade);
        document.getElementById("infoUSER").innerHTML = infoUser;  

        // agora vou carregar os dados da agencia
        carregaAgencias();
    }
}


function carregaAgencias(){
    fetch("http://localhost:8088/agencia")
     .then(res => res.json())
     .then(listaAgencias => preencheComboBox(listaAgencias)); 
 }
 
 function preencheComboBox(listaAgencias){
     var templateSelect = `<select class="form-control" id="selectAg"> {{OPCOES}} </select>`;
     var templateOption = `<option value="{{VALOR}}"> {{NOME}} </option>`;
     
     var opcoes = "";
     for (i=0; i<listaAgencias.length; i++){
         var ag = listaAgencias[i];
         opcoes = opcoes + templateOption.replace("{{VALOR}}", ag.id)
                                         .replace("{{NOME}}", ag.nome);
     }
     var novoSelect = templateSelect.replace("{{OPCOES}}", opcoes);
     document.getElementById("optionAgencia").innerHTML = novoSelect;
}

function gerarRelatorio(){
    // para saber se tá todo mundo "checado"
    var combinacao = 0;
    if (document.getElementById("selectAgencia").checked){
        combinacao = combinacao + 1;
    } 
    if (document.getElementById("selectData").checked){
        combinacao = combinacao + 2;
    } 
    if (document.getElementById("selectCliente").checked){
        combinacao = combinacao + 4;
    } 
    console.log("Combinacao = "+combinacao);
   
    var op = document.getElementById("selectAg");
    console.log(op.options[op.selectedIndex].value);
    console.log(document.getElementById("txtData").value);
    console.log(document.getElementById("txtCliente").value);

    if(combinacao == 0){//sem filtro
        fetch("http://localhost:8088/agendamento/todos")
                  .then(res => res.json())
                  .then(res => trataResultado(res));
    }else if(combinacao == 1){
        fetch("http://localhost:8088/agendamentos/filtrarporagencia?agencia=" + document.getElementById("selectAg").value)
                  .then(res => res.json())
                  .then(res => trataResultado(res));

    }else if(combinacao == 2){ //só data
        fetch("http://localhost:8088/agendamentos/filtrarpordata?data=" + document.getElementById("txtData").value)
        .then(res => res.json())
        .then(res => trataResultado(res));
        
    }else if(combinacao == 3){//agencia+data
        fetch("http://localhost:8088/agendamentos/filtrarporAgenciaData?agencia=" + document.getElementById("selectAg").value + "&data=" + document.getElementById("txtData").value)
        .then(res => res.json())
        .then(res => trataResultado(res));
        
    }else if(combinacao == 4){//só cliente
        fetch("http://localhost:8088/agendamentos/filtrarporcliente?nomecli=" + document.getElementById("txtCliente").value)
                  .then(res => res.json())
                  .then(res => trataResultado(res));
        
    }else if(combinacao == 5){//agencia+cliente
        fetch("http://localhost:8088/agendamentos/filtrarporAgenciaCliente?agencia=" + document.getElementById("selectAg").value + "&nomecli=" + document.getElementById("txtCliente").value)
        .then(res => res.json())
        .then(res => trataResultado(res));
        
    }else if(combinacao == 6){//data+cliente
        fetch("http://localhost:8088/agendamentos/filtrarpordataCliente?data=" + document.getElementById("txtData").value + "&nomecli=" + document.getElementById("txtCliente").value)
        .then(res => res.json())
        .then(res => trataResultado(res));
        
    }else {//agencia+data+cliente
        fetch("http://localhost:8088/agendamentos/filtrarporagenciaDataCliente?agencia="+ document.getElementById("selectAg").value + "&data=" + document.getElementById("txtData").value + "&nomecli=" + document.getElementById("txtCliente").value)
        .then(res => res.json())
        .then(res => trataResultado(res));
    }
}

function trataResultado(res){
    var rel = "<br><table border=2 width='100%'>";
    rel += "<tr><th>Agencia</th><th>Nome</th><th>Email</th><th>Telefone</th><th>Data</th><th>Hora</th><th>Observacoes</th></tr>"
    for(i=0; i<res.length; i++){
        var ag = res[i];
        rel += "<tr>" + "<td>"+ ag.agc.nome + "</td>" + "<td>" +ag.nomeCliente + "</td>" + "<td>" + ag.emailCliente + "</td>" + "<td>" + ag.celularCliente + "</td>" + "<td>" + ag.dataAgendamento + "</td>" + "<td>" + ag.horaAgendamento + "</td>" + "<td>" + ag.observacoes + "</td>";

    }
    rel += "</table><br>";
    document.getElementById("relatorios").innerHTML = rel;

}

function logout(){
    localStorage.removeItem("ScheduleUSER");
    window.location = "TelaLogin1.html";
}

