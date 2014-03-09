

Lists = new Meteor.Collection("lists");

Template.theGrid.cell = function () {
  return Lists.find({});
};

Meteor.startup(function () { 
var $windowPane = $(window);


  // $$(window)

  // render('cell', {'cells':cells}, function(render) {





// Meteor.Loader.loadJs('client/js/lib/jquery.gridster.with-extras.min.js', function(){
//   console.log('lib loaded!');

  $(".grid").gridster({
    widget_margins: [10,10],
    widget_base_dimensions:
      [
        ($windowPane.width() / 5 ) - 20,
        ($windowPane.height() / 5 ) - 20
      ],
    resize: {
      enabled: true
    },
    draggable: {
      handle: '.grab'
    }   
  });
// });

// $('.grid').css('background-color','red');



    // $.each(cells, function(e){
    //   new Medium({
    //       element: document.getElementById('cellEdit_'+cells[e].id),
    //       tags:{
    //         paragraph: 'p'
    //       }
    //   });

    //   $('.cellEdit').typing({
    //     stop: function(){
    //       console.log('so soon?');
    //     },
    //     delay:500
    //   });
    // });



  // });
});


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
