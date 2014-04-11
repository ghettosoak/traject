

Lists = new Meteor.Collection("lists");


var theLists = Lists.find({});
var cellCount;
var readySetGo = 0;

Template.theGrid.cell = function () {
  return theLists;
};

Template.cell.rendered = function() {

    if(!this._rendered) {
      this._rendered = true;

      readySetGo ++;
      if (readySetGo === Lists.find({}).count()) UpandRunning();
    }
}

function UpandRunning(){

  console.log('yeah!!');



  $(".grid").gridster({
    widget_margins: [10,10],
    widget_base_dimensions:
      [ 240,240
        // ($windowPane.width() / 5 ) - 20,
        // ($windowPane.height() / 5 ) - 20
      ]//,
    // resize: {
    //   enabled: true
    // },
    // draggable: {
    //   handle: '.grab'
    // }   
  });


 $('.cellEdit').each(function(){
   
   // new Medium({
   //   // element: document.getElementById('cellEdit_'+cells[e].id),
   //   element: this,
   //   tags:{
   //     paragraph: 'p'
   //   }
   // });

 }); 
}

// });

Template.theGrid.invokeAfterLoad = function () {
  Meteor.defer(function () {
     


  });
  return "";
};



// Meteor.startup(function () { 



  var $windowPane = $(window);


  // $$(window)

  // render('cell', {'cells':cells}, function(render) {


  // $(".grid").gridster({
  //   widget_margins: [10,10],
  //   widget_base_dimensions:
  //     [
  //       ($windowPane.width() / 5 ) - 20,
  //       ($windowPane.height() / 5 ) - 20
  //     ],
  //   resize: {
  //     enabled: true
  //   },
  //   draggable: {
  //     handle: '.grab'
  //   }   
  // });

// $('.grid').css('background-color','red');



    // $.each(cells, function(e){
      $('.cellEdit').each(function(){
        console.log(this)
        
        // new Medium({
        //   // element: document.getElementById('cellEdit_'+cells[e].id),
        //   element: this,
        //   tags:{
        //     paragraph: 'p'
        //   }
        // });
      });

      var theCells = Lists.find({});
    theCells.forEach(function(cell){ 
      console.log(cell)
      // new Medium({
      //     element: document.getElementById('cellEdit_'+cells[e].id),
      //     tags:{
      //       paragraph: 'p'
      //     }
      // });
    })

      $('.cellEdit').typing({
        stop: function(){
          console.log('so soon?');
        },
        delay:500
      });


  // });
// });


// if (Meteor.isClient) {
//   Template.hello.greeting = function () {
//     return "Welcome to traject.";
//   };

//   Template.hello.events({
//     'click input': function () {
//       // template data, if any, is available in 'this'
//       if (typeof console !== 'undefined')
//         console.log("You pressed the button");
//     }
//   });
// }

// if (Meteor.isServer) {
//   Meteor.startup(function () {
//     // code to run on server at startup
//   });
// }
