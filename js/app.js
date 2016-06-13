$(function(){
    
    var queriesTotalSpan=$("#totalNum");
    var queriesSuccessfulSpan=$("#successfulNum");
    
    function totalQueriesCounter(){
        var strTotalCounter=localStorage.getItem("totalCounter");
        if(strTotalCounter===null || strTotalCounter==="null"){
            var totalCounter=0;
        }
        else{
            totalCounter=parseInt(strTotalCounter);
        }
        totalCounter++;
        queriesTotalSpan.text(totalCounter);
        localStorage.setItem("totalCounter", totalCounter);
    }
    
    function successfulQueriesCounter(){
        var strSuccessfulCounter=localStorage.getItem("successfullCounter");
        if(strSuccessfulCounter===null || strSuccessfulCounter==="null"){
            var successfullCounter=0;
        }
        else{
            successfullCounter=parseInt(strSuccessfulCounter);
        }
        successfullCounter++;
        queriesSuccessfulSpan.text(successfullCounter);
        localStorage.setItem("successfullCounter", successfullCounter);
    }
    
    
    //funkcja wczytująca wszystkie książki i wypisująca je na stronie
    var loadAllBooks = function(){
        var bookList = $("#listWithBooks");
        $.ajax({
            url: "http://192.168.33.22/REST_bookshelf/api/books.php",
            method: "GET",
            dataType: "JSON"
        }).done(function(bookNamesArray){
            bookList.empty();
            successfulQueriesCounter();
            for(var i = 0; i < bookNamesArray.length; i++){
                var newLi = $("<li>");
                var removeButton = $('<button class="delbtn">Delete</button>');
                var showButton = $('<button class="showbtn">Show more info</button>');
                newLi.attr("data-id", bookNamesArray[i].id);
                newLi.text(bookNamesArray[i].name+" ");
                newLi.append(showButton);
                newLi.append(removeButton);
                bookList.append(newLi);
            }
        }).fail(function(xhr, status, error){
            console.log("Load all books ajax failed");
        }).always(function(){
            totalQueriesCounter();
        });
    };
    
    //do przycisków o klasie showbtn dodano onclick pokazującą diva z opisem książki
    var bookList = $("#listWithBooks");
    bookList.on("click",".showbtn", function(event){
       var button = $(this);
       var bookId = button.parent().data("id");
       var buttonParent = $(this).parent();
       $.ajax({
           url: "http://192.168.33.22/REST_bookshelf/api/books.php",
           method: "GET",
           data: {id: bookId},
           dataType: "JSON"
       }).done(function(response){
           if(typeof response =="object"){
               var newDiv = $("<div><h1>" + response.title + "</h1>"+ "<p>"+ response.author + "</p>" + "<p>" + response.description + "</p>" +"</div>");
               buttonParent.append(newDiv);
               button.removeClass("showbtn");
               button.text("Hide");
               button.addClass("hidebtn");
               var editForm=$("<form id='editBook' method='POST' action='#' style='display:inline-block'><fieldset><legend>Edit book:</legend><p><input type='text' name='newTitle' maxlength='255' placeholder='Edit title'></p><p><input type='text' name='newAuthor' maxlength='255' placeholder='Edit author'></p><p><textarea type='text' name='newDescription' placeholder='Edit description'></textarea></p><p><input type='submit' value='submit'></p></filedset></form>");
           }
           else if(typeof response =="string"){
               var newDiv = $("<div><h1>"+response+"</p>" +"</div>");
               buttonParent.append(newDiv);
               button.removeClass("showbtn");
               button.text("Hide");
               button.addClass("hidebtn");
           }
           newDiv.append(editForm);
           successfulQueriesCounter();
       }).fail(function(xhr, status, error){
           console.log("Ajax failed when reading book with id" + bookId);
       }).always(function(){
            totalQueriesCounter();
        });
    });
    
    //do przycisków z klasą hidebtn dodano onclick event chowający diva z opisem książki
    bookList.on("click", ".hidebtn", function(event){
        var button = $(this);
        var buttonParent = $(this).parent();
        buttonParent.children("div").empty();
        button.removeClass("hidebtn");
        button.text("Show more info");
        button.addClass("showbtn");
    });
    
    var form=$("#newBook");
    
    //do formularza dodawania książki dodano submit event pozwalający dodać do bazy danych nową książkę
    form.on("submit", function(event){
        event.preventDefault();
        var formData = form.serializeArray();
        $.ajax({
            url: "http://192.168.33.22/REST_bookshelf/api/books.php",
            method: "POST",
            data: formData,
            dataType: "JSON"
        }).done(function(json){
            if(json['status']==="success"){
                form.find("input").eq(0).prop("value", "");
                form.find("input").eq(1).prop("value", "");
                form.find("textarea").prop("value", "");
                loadAllBooks();
                successfulQueriesCounter();
            }
        }).fail(function(xhr, status, error){
            console.log("Ajax faild when submiting new book");
        }).always(function(){
            totalQueriesCounter();
        });
    });
    
    bookList.on("click", ".delbtn", function(event){
        var button = $(this);
        var bookId = button.parent().data("id");
        $.ajax({
            url: "http://192.168.33.22/REST_bookshelf/api/books.php",
            method: "DELETE",
            data: {id: bookId},
            dataType: "JSON"
        }).done(function(json){
            if(json['status']==="success"){
                loadAllBooks();
                successfulQueriesCounter();
            }
        }).fail(function(xhr, status, error){
            console.log("Ajax faild when deleting book with id="+bookId);
        }).always(function(){
            totalQueriesCounter();
        });
    });
    
    bookList.on("submit", "#editBook", function(event){
        event.preventDefault();
        var editForm=$(this);
        var bookId = editForm.parent().parent().data("id");
        var editData=editForm.serialize(); 
        
        $.ajax({
            url: "http://192.168.33.22/REST_bookshelf/api/books.php",
            method: "PUT",
            data: "id="+bookId+"&"+editData,
            dataType: "JSON"
        }).done(function(json){
            if(json['status']==="success"){
                loadAllBooks();
                successfulQueriesCounter();
            }
        }).fail(function(xhr, status, error){
            console.log("Ajax faild during editing book with id="+bookId);
        }).always(function(){
            totalQueriesCounter();
        });
    });
    
    
    loadAllBooks();
    

});

