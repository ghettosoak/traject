// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  // if (Lists.find().count() === 1) {
    
  var firstStrike = [
    "things I'd like to read",
    "things I'd like to write",
    "books i'd like to read",
    "things I'd like to look up", 
    "things I'd like to watch",
    "things I'd like to cook",
    "people I'd like to talk to ",
    "games i'd like to play",
    "movies i'd like to watch"
  ];

    var timestamp = (new Date()).getTime();
    // for (var i = 0; i < firstStrike.length ; i++) {
    //   var theStuff = {
    //     id: i,
    //     title: firstStrike[i],
    //     listCreated: timestamp,
    //     promotedToMobile: true,
    //     dimensional:{
    //       x:1,
    //       y:2,
    //       height: 1,
    //       width: 1
    //     },
    //     content: [
    //       {
    //         id: 'alhgfghbjkfg', 
    //         valueCreated: timestamp,
    //         value: 'this is a point on the list. it is something i would like to do.'
    //       },
    //       {
    //         id: 'alhgfghbjkfg',
    //         valueCreated: timestamp,
    //         value: 'this is a point on the list. it is something i would like to do.'
    //       },
    //       {
    //         id: 'alhgfghbjkfg',
    //         valueCreated: timestamp,
    //         value: 'this is a point on the list. it is something i would like to do.'
    //       }, 
    //       {
    //         id: 'alhgfghbjkfg',
    //         valueCreated: timestamp,
    //         value: 'this is a point on the list. it is something i would like to do.'
    //       },
    //       {
    //         id: 'alhgfghbjkfg',
    //         valueCreated: timestamp,
    //         value: 'this is a point on the list. it is something i would like to do.'
    //       }
    //     ]
    //   };
    //   Lists.insert(theStuff);


      timestamp += 1; // ensure unique timestamp.
  // }
// }
      // Lists.remove({});
  console.log(Lists.find().count());
});
