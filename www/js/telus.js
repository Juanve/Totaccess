///////      Funciones de edicion de apps        ////// 

function doLogin(){
        localStorage["user"] = $("#inputUser").val ();
        localStorage["pass"] = $("#inputPass").val ();
        $.ajax
        ({
              type: "GET",
              url: "https://api.github.com/user",
              async: true,
              dataType: 'json',
              beforeSend: function (xhr) {
                 xhr.setRequestHeader('Authorization', make_base_auth(localStorage["user"], localStorage["pass"]));
             },
              success: function (data){
                  var loginUser = data.login;
                  localStorage["loginUser"] = loginUser;
              },
              error: function (msg){
                localStorage.removeItem("user");
                localStorage.removeItem("pass");
                var error = $.parseJSON(msg.responseText);
                if (error.message === "Bad credentials"){
                  alert("User or Password are Incorrect");
                } else {
                  alert('Sorry no se pudo loguear: ' + msg.responseText);
                }
              }
        });
}

function build(){
        $.ajax
        ({
              type: "GET",
              url: "http://telus.crontopia.com/gisicom/updatecode.php",
              async: true,
              success: function (data){
                if (data == "OK"){
                  alert('Rebuild In Progress !!...');
                } else {
                  alert('Error in Rebuild Process...' + data);
                }
              },
              error: function (msg){
                alert('Sorry no se pudo contactar al proxy de telus: ' + msg.responseText);
              }
        });
}

function getContent(path){
         
        $.ajax
        ({
              type: "GET",
              url: "https://api.github.com/repos/" + localStorage["loginUser"] + "/Gisicom/contents/" + path,
              async: true,
              dataType: 'json',
              beforeSend: function (xhr) {
                 xhr.setRequestHeader('Authorization', make_base_auth(localStorage["user"], localStorage["pass"]));
             },
              success: function (data){
                  var coden = data.content;
                  var codeRaw = Base64.decode(coden.replace('','\n'));
                  $("#codeArea").val(codeRaw);
                  $("#fileSha").text(data.sha);
                  $("#filePath").text(data.path);
                  
              },
              error: function (msg){
                alert('Sorry no se pudo obtener el contenido del archivo: ' + msg.responseText);
              }
        });
}

function updateContent(){
        var content = btoa($("#codeArea").val());
        var fileSha = $("#fileSha").text();
        var filePath = $("#filePath").text();
        var msg = "Updating " + filePath;
        var dataObject = {
            'message': msg,
            'content': content,
            'sha': fileSha
        };
        $.ajax
        ({
              type: "PUT",
              url: "https://api.github.com/repos/" + localStorage["loginUser"] + "/Gisicom/contents/" + filePath,
              contentType: 'application/json',
              data: JSON.stringify(dataObject),
              async: true,
              beforeSend: function (xhr) {
                 xhr.setRequestHeader('Authorization', make_base_auth(localStorage["user"], localStorage["pass"]));
             },
              success: function (data){
                 $("#fileSha").text(data.content.sha);
                 alert("Successfull Updated " + data.content.name );
              },
              error: function (msg){
                alert('Sorry no se pudo actualizar el contenido archivo: ' + msg.responseText);
              }
        });
}
    
function make_base_auth(user, password) {
       var tok = user + ':' + password;
       var hash = btoa(tok);
       return 'Basic ' + hash;
}

function onPreview(){
        var ref = window.open('http://telus.crontopia.com/gisicomweb/www/', '_blank', 'location=no');
        //ref.addEventListener('loadstart', function() { alert(event.url); });
}

function goEdit(){
   if ($("#editBtn").html() == "Edit"){
    $("#editPanel").css ("display","block");
    $("#runPanel").css ("display","none");
    $("#editBtn").html("Run");
   } else {
    $("#editPanel").css ("display","none");
    $("#runPanel").css ("display","block");
    $("#editBtn").html("Edit");
   }
}