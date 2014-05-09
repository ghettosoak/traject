db.testdatas.insert(
	{
		sizeX: 1,
		sizeY: 1,
		row: 0,
		col: 5,
		gaze: false,
		wristwatch: false,
		addcell:false,
		list: true,
		cellID: 000,
		title: "this is a title",
		bitCount:7,
		body: [
		 	{ 
		 		bitID:0,
	 			opened: 123,
				closed: null,
				displayed: true,
				order:3,
				type:'plainText',
				content:'this is some text, order 3'
			},
		 	{ 
		 		bitID:1,
	 			opened: 123,
				closed: null,
				displayed: true,
				order:2,
				type:'plainText',
				content:'this is some text, order 2'
			},
		 	{ 
		 		bitID:2,
	 			opened: 123,
				closed: null,
				displayed: true,
				order:1,
				type:'plainText',
				content:'this is some text, order 1'
			}
		]
	}
);
