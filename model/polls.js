(function(){
    
    var mongoose = require('mongoose');
    var shortid = require("shortid");

    var Poll = mongoose.model("Poll", new mongoose.Schema({ 
        _id: {
            type: String,
            unique: true,
            'default': shortid.generate
        },
        ownerName: String,
        ownerEmail: String,
        title: String,
        results: [],
        voters: [String]
    }));
        
    module.exports = Poll;
    
}());