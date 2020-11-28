
// initalize default values for comments array - array is set up in chronological order to allow for .push use
let comments = [
    {
        name:"Theodore Duncan",
        timeStamp:"11/15/2018",
        message: "How can someone be so good!!! You can tell he lives for this and loves to do it every day. everytime I see him I feel instantly happy! He’s definitely my favorite ever!"
    },
    {
        name:"Gary Wong",
        timeStamp:"12/12/2018",
        message: "Every time I see him shred I feel so motivated to get off my couch and hop on my board. He’s so talented! I wish I can ride like him one day so I can really enjoy myself!"
    },
    {
        name:"Michael Lyons",
        timeStamp:"12/18/2018",
        message:"They BLEW the ROOF off at their last show, once everyone started figuring out they were going. This is still simply the greatest opening of a concert I have EVER witnessed"
    }
]

// DIVING DEEPER --> Function that takes the timestamp of an object as a parameter and returns a message stating the difference between that time and the current time
let timePassed = time =>{
    // get the current date and time 
    let today = new Date();
    //get the data recorded when a post was made - new date added to accommodates the default values
    let posted = new Date(time);

    // find the difference between the time now and the post's timestamp
    let diffTime = today.getTime() - posted.getTime();

    // define the method of reduction for the units array
    const reducer = (accumulator, currentValue) => accumulator*currentValue;
    
    // values used to convert milliseconds to seconds, minutes, hours, days, years, weeks,months and years
    conversions = [1000,60,60,24,7,4,12];

    // initialize the array to hold the differences in time for each unit [milliseconds --->years]
    var diffTimes = [diffTime];
    
    for (let i=0; i<conversions.length; i++){
        let units = [];
        // for each unit, get the conversion values needed and push it into an array
        units.push(conversions[i]);
        // divide the difference in milliseconds by the multiplication of all the conversion values in the array
        diffTimes.push(diffTimes[i]/units.reduce(reducer));
    }
    // reverse the order of the resulting array [years --> milliseconds]
    diffTimes = diffTimes.reverse();    

    // define an array to hold the units associated with each value of the diffTimes array
    let diffunits = ["year","month", "week", "day", "hour", "minute","< 1 min","< 1 min"];

    // Round all the time differences down to the nearest whole number - this will create 0s for the smaller units that we don't want to use
    let convertedDates = diffTimes.map(date=>Math.floor(date));
    
    // find the location of the first value in the diffTimes array that is not 0
    let timeLoc = convertedDates.findIndex(date=>date!=0);
    
    // find the first value in the diffTimes array is not o
    let timediff = timeLoc < 0 ? diffunits[7] : convertedDates.find(date=>date!=0);
    // get the units associated with the time diff value
    let tempunits = timeLoc < 0 ? diffunits[7] : diffunits[timeLoc]; 

    // take into account if the units should present as singular or plural
    let units = (timediff===1 || tempunits=="< 1 min") ? tempunits : tempunits+"s";

    // determine the message to be returned - if it is anything less than minutes than the value of timeDiff isn't included
    let timeMessage = (units === "< 1 min") ? `${units} ago` : `${timediff} ${units} ago`
    
    return timeMessage;
}


// This function builds and displays a comment based on the object passed to it
const displayComment = (newComment) =>{

    // Element containing the comment avatar
    let commentAvatar = document.createElement('div');
    commentAvatar.classList.add("comment__avatar");

    // Element containing the comment name
    let commentName = document.createElement('div');
    commentName.classList.add("comment__details-name");
    commentName.innerText = newComment.name;

    // Element containing the comment timestamp
    let commentTime = document.createElement('div');
    commentTime.classList.add("comment__details-timestamp");
    // display the time stamped as a time passed message    
    commentTime.innerText = timePassed(newComment.timeStamp);

    // Element containing the comment message
    let commentMessage = document.createElement('div');
    commentMessage.classList.add("comment__details-message");
    commentMessage.innerText = newComment.message;

    // div containing the message and time stamp
    let commentDetailsHeader = document.createElement('div');
    commentDetailsHeader.classList.add('comment__details-header');
    commentDetailsHeader.appendChild(commentName);
    commentDetailsHeader.appendChild(commentTime);

    //div containing header and message
    let commentDetails = document.createElement('div');
    commentDetails.classList.add('comment__details')
    commentDetails.appendChild(commentDetailsHeader);
    commentDetails.appendChild(commentMessage);

    // div containing avatar and comment details
    let comment = document.createElement('div');
    comment.classList.add("comment");
    comment.appendChild(commentAvatar);
    comment.appendChild(commentDetails);

    //Once the comment is built add it to the comment list
    let commentsList = document.querySelector('.comments__list');
    commentsList.prepend(comment);
}

/* loop through each object in the comments array - build the html element and display it*/
comments.forEach(comment =>{
    displayComment(comment);
});


let commentForm = document.querySelector('.new-comment__form');
// submit the form values using an event listener
commentForm.addEventListener('submit', event=>{
    // prevents the page from reloading upon submit
    event.preventDefault();

    // create a new comment object from the values submitted
    let newComment = {
        name:event.target.name.value,
        timeStamp:new Date(),
        message:event.target.message.value
    }

    //push the new comment to the comments array
    comments.push(newComment);

    //clear all the previous comments from the screen
    const allComments = document.querySelectorAll('.comment');
    allComments.forEach(comment=>{
        comment.remove();
    });
    
    // re-render all the comments from the comment array
    comments.forEach(comment =>{
        displayComment(comment);
    });
    
    // Reset the input boxes with a blank value and the placeholder
    event.target.name.value="";
    event.target.message.value="";
});

