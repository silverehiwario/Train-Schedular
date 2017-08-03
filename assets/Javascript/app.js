 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDPhvm6G6Ku5KQKz-nr0ZZi6zLr68BECyw",
    authDomain: "train-project-64b92.firebaseapp.com",
    databaseURL: "https://train-project-64b92.firebaseio.com",
    projectId: "train-project-64b92",
    storageBucket: "",
    messagingSenderId: "414941495009"
  };
  firebase.initializeApp(config);

    



    var database = firebase.database();
    var TrainSchedule = database.ref("/TrainSchedule");
    var newTrain = {};;
    
                    






    $("button").on("click", function() {
        event.preventDefault();
        newTrain.name = $("#exampleInputTrainName").val().trim();
        newTrain.destination = $("#exampleInputDestination").val().trim();
        newTrain.time = $("#exampleInputTrainTime").val().trim();
        newTrain.frequency = $("#exampleInputTrainFrequency").val().trim();
        console.log(newTrain);

        TrainSchedule.push(newTrain);
    

     // clear input boxes    
        $("#exampleInputTrainName").val("");
        $("#exampleInputDestination").val("");
        $("#exampleInputTrainTime").val("");
        $("#exampleInputTrainFrequency").val("");

          

    });

     TrainSchedule.on("child_added", function(childSnapshot,  prevChildKey) {

    var tFrequency = childSnapshot.val().frequency;
    // Time is 3:30 AM
    var firstTime = childSnapshot.val().time;
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);
    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
    console.log("ARRIVAL TIME: " + nextTrain);

    var status = "On Time";

        if ( tMinutesTillTrain > 2 && tMinutesTillTrain < 10 ) {
            status = "All Aboard";
        } else if ( tMinutesTillTrain > 1 && tMinutesTillTrain < 3 )    {
            status = "Final Boarding";
        } else if ( tMinutesTillTrain < 2 ) {
            status = "Departing";   
        } ;  






          var newRow =    $('<tr id="' + childSnapshot.key + '"><td>' + childSnapshot.val().name + '</td><td>' + childSnapshot.val().destination + '</td><td class = "big">' + childSnapshot.val().time + '</td><td>' + childSnapshot.val().frequency + '</td><td>' + nextTrain + '</td><td>' + tMinutesTillTrain + '</td><td id = "status">' + status + '</td></tr>'
    ).append('<button id="up">' + "Update" + '</button><button id="down">' + "Remove" + '</button><button id="ups">' + "Save" + '</button>');
            //$(".big").addClass("hide");

            $('.table').append(newRow);
        
    
 });

    
   $(document).on('click', '#down', function () { // <-- changes
    var $row = $(this).closest('tr');
    // this line will retrieve the row's ID which has been set to
    // the train's database key.
    var trainKey = $row.attr('id');
    // log the train's key
    console.log(trainKey);
    // .data('id') does not retrieve the element's ID
    // var rowId = $row.data('id');
    
    // remove the train from the database using it's key
    database.ref('/TrainSchedule/' + trainKey).remove();
    $row.remove();

    return false;
 });
   



   var update = $(document).on('click', '#up', function () { // <-- changes

    var par = $(this).closest('tr'); 
    var tdName = par.children("td:nth-child(1)"); 
    var tdDestination = par.children("td:nth-child(2)"); 
    var tdfirstTime = par.children("td:nth-child(3)"); 
    var tdFrequency = par.children("td:nth-child(4)"); 

    tdName.html("<input type='text' id='txtName' value='"+tdName.html()+"'/>"); 
    tdDestination.html("<input type='text' id='txtdestination' value='"+tdDestination.html()+"'/>");
    tdfirstTime.html("<input type ='time' id = 'txttime' value='"+tdfirstTime.html()+"'/>");
    tdFrequency.html("<input type='number' id='txtfrequency' value='"+tdFrequency.html()+"'/>"); 

    

      $(document).on('click', '#ups', function () { 
     var $row = $(this).closest('tr');
     var trainKey = $row.attr('id');
     var Name = tdName.children("input[type=text]").val();
     var Destination= tdDestination.children("input[type=text]").val();
     var Time =tdfirstTime.children("input[type=time]").val();
     var Frequency= tdFrequency.children("input[type=number]").val();

    //Update to firebase

      var trainKeyNew= {
             name: Name,
      destination: Destination,
       time: Time,
       frequency: Frequency 
    };
   
   // var Update={};
    // UPDATE the train from the database using it's key
    database.ref('/TrainSchedule/' + trainKey).update(trainKeyNew);

     tdName.html(Name); 
      tdDestination.html(Destination); 
      tdfirstTime.html(Time); 
      tdFrequency.html(Frequency); 


        });
    


  });







// Start Clock With Current Time
    
    function StartClockNow() {
        clockInterval = setInterval(function() {
            //Display clock
          //  $('#currentTime').html(moment().format('H:mm'));

            //Add code to update the screen every minute
           // $('#trains').empty();
            TrainSchedule.once("value", function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();
                            // Store everything into a variable.
                    var trainName = childSnapshot.val().name;
                    var destination = childSnapshot.val().destination;
                    var firstDeparture = childSnapshot.val().time;
                    var frequency = childSnapshot.val().frequency;
                    

                    // Calculate mins to next train
                    
                    var tFrequency = childSnapshot.val().frequency;
                     // Time is 3:30 AM
                      var firstTime = childSnapshot.val().time;
                    // First Time (pushed back 1 year to make sure it comes before current time)
                    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
                    console.log(firstTimeConverted);
                     // Current Time
                    var currentTime = moment();
                     console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
                    // Difference between the times
                     var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
                     console.log("DIFFERENCE IN TIME: " + diffTime);
                     // Time apart (remainder)
                    var tRemainder = diffTime % tFrequency;
                    console.log(tRemainder);
                   // Minute Until Train
                   var updatetMinutesTillTrain = tFrequency - tRemainder;
                   console.log("MINUTES TILL TRAIN: " + updatetMinutesTillTrain);
                   // Next Train
                   var updatenextTrain = moment().add(updatetMinutesTillTrain, "minutes").format("hh:mm A");
                  console.log("ARRIVAL TIME: " + updatenextTrain);


                    trainName = $("#exampleInputTrainName").val().trim();
                    destination = $("#exampleInputDestination").val().trim();
                    firstDeparture = $("#exampleInputTrainTime").val().trim();
                    frequency = $("#exampleInputTrainFrequency").val().trim();

                    // Update train status based on remaining time till next train

                    var status = "On Time";

                        if ( updatetMinutesTillTrain > 2 && updatetMinutesTillTrain < 10 ) {
                          status = "All Aboard";
                         } else if ( updatetMinutesTillTrain > 1 && updatetMinutesTillTrain < 3 )    {
                            status = "Final Boarding";
                         } else if (updatetMinutesTillTrain < 2 ) {
                          status = "Departing";   
                           } ;  

                    // Add each train's data into the table

               var newRow = $('<tr id="' + childSnapshot.key + '"><td>' + childSnapshot.val().name + '</td><td>' + childSnapshot.val().destination + '</td><td class = "big">' + childSnapshot.val().time + '</td><td>' + childSnapshot.val().frequency + '</td><td>' + updatenextTrain + '</td><td>' + updatetMinutesTillTrain + '</td><td id = "status">' + status + '</td></tr>'
                 ).append('<button id="up">' + "Update" + '</button><button id="down">' + "Remove" + '</button><button id="ups">' + "Save" + '</button>');


              

                }); 
            });
    
        }, 1000 * 60);
    }   

  //  $('#currentTime').html(moment().format('H:mm'));
    StartClockNow(); 



 




















//function UpdateRow() {
  


  //return firebase.database().ref().update(updates);
//}






   