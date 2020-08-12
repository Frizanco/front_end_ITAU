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
}