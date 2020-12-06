// Declare variables for API calls
let apiURL = "https://project-1-api.herokuapp.com/comments";
apiKey = "ff3a12db-f14e-431c-a352-c5da9393f05b";

let getPath = `${apiURL}?api_key=${apiKey}`;
let postPath = `${apiURL}?api_key=${apiKey}`;

//Declare the Comment prototype
function Comment(){
    this.setAvatar = function(image){
        this.avatar = image;
    }
}

/*=================================================== FUNCTION DECLARATIONS =============================================================================*/

/**
 * Function: timePassed
 * Useage: takes the timestamp of an object as a parameter and returns a message stating the difference time passed in a readable format
 * @param {Date} time 
 */

let timePassed = time =>{
    // get the current date and time 
    let today = new Date();
    //get the data recorded when a post was made - new date added to accommodates the default values
    let posted = new Date(time);

    // find the difference between the time now and the post's timestamp
    let diffTime = today.getTime() - posted.getTime();

    // values used to convert milliseconds to seconds, minutes, hours, days, years, weeks,months and years
    conversions = [1000,60,60,24,7,4,12];

    // initialize the array to hold the differences in time for each unit [milliseconds --->years]
    var diffTimes = [diffTime];
    
    for (let i=0; i<conversions.length; i++){
        let units = [];
        // for each unit, get the conversion values needed and push it into an array
        units.push(conversions[i]);
        // divide the difference in milliseconds by the multiplication of all the conversion values in the array
        diffTimes.push(diffTimes[i]/units.reduce((acc,curr)=>acc*curr));
    }
    // reverse the order of the resulting array [years --> milliseconds]
    diffTimes = diffTimes.reverse();    

    // define an array to hold the units associated with each value of the diffTimes array
    let diffunits = ["year","month", "week", "day", "hour", "minute","< 1 minute","< 1 minute"];

    // Round all the time differences down to the nearest whole number - this will create 0s for the smaller units that we don't want to use
    let convertedDates = diffTimes.map(date=>Math.floor(date));
    
    // find the location of the first value in the diffTimes array that is greater than 0
    let timeLoc = convertedDates.findIndex(date=>date>0);
  
    // find the first value in the diffTimes array is not 0
    let timediff = timeLoc < 0 ? diffunits[7] : convertedDates.find(date=>date!=0);
        
    // get the units associated with the time diff value
    let tempunits = timeLoc < 0 ? diffunits[7] : diffunits[timeLoc]; 

    // take into account if the units should present as singular or plural
    let units = (timediff===1 || tempunits=="< 1 minute") ? tempunits : tempunits+"s";

    // determine the message to be returned - if it is anything less than minutes than the value of timeDiff isn't included
    let timeMessage = (units === "< 1 minute") ? `${units} ago` : `${timediff} ${units} ago`
    
    return timeMessage;
}

/**
 * Function: displayComment
 * Useage: builds the html structure of a comment and displays data based on the object passed to it
 * @param {comment Object} newComment 
 */
const displayComment = (newComment) =>{

    //create the "data-id" attribute to be used to identify elements associated with specific comments
    document.createAttribute('data-id');

    // Element containing the comment avatar
    let commentAvatar = document.createElement('div');
    commentAvatar.classList.add("comment__avatar");
    //set the background image of the avatar
    commentAvatar.style.backgroundImage = newComment.avatar;
    
    // Element containing the comment name
    let commentName = document.createElement('div');
    commentName.classList.add("comment__details-name");
    commentName.innerText = newComment.name;

    // Element containing the comment timestamp
    let commentTime = document.createElement('div');
    commentTime.classList.add("comment__details-timestamp");
    // display the time stamped as a time passed message    
    commentTime.innerText = timePassed(newComment.timestamp);

    // Element containing the comment message
    let commentMessage = document.createElement('div');
    commentMessage.classList.add("comment__details-message");
    commentMessage.innerText = newComment.comment;

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

    let commentBottom = document.createElement('div');
    commentBottom.classList.add("comment__bottom");

    // div containing likes data
    let likes = document.createElement('div');
    likes.classList.add('comment__likes');
    // Set the data-id attribute to the comment id from the api to update the appropriate API object
    likes.setAttribute('data-id', newComment.id);
    likes.innerText = "👍 " + newComment.likes;
    commentBottom.appendChild(likes);

    // add an event listener to the likes div to allow the user to like a comment
    likes.addEventListener('click', event=>{
        // get the id of the comment to update the appropriate data in the API
        let likeID = event.target.getAttribute('data-id');
        
        // update the likes associated with the appropriate comment
        axios.put(`${apiURL}/${likeID}/like?api_key=${apiKey}`)
        .then(res=> likes.innerText = "👍 " + res.data.likes)
        .catch(err=>console.log(err));
    });

    //button used to delete comments
    deleteBtn = document.createElement('button');
    deleteBtn.classList.add("comment__delete");
    deleteBtn.innerText = "x";
    
    // data-id attribute is created for the delete button containing the id for the comment from the API
    deleteBtn.setAttribute('data-id', newComment.id);
    
    //tool tip to identify what the "x" button does - used for content in :before pseudo-element
    deleteBtn.setAttribute('data-tooltip', "Delete");
    commentBottom.appendChild(deleteBtn);

    // add an event listener to each delete button that is created
    deleteBtn.addEventListener('click', event=>{
        //gets the id associated with the appropriate comment for the API call
        let commentID = event.target.getAttribute('data-id');
        
        // find the element associated with that id and remove it from the page
        let removedComment = document.querySelector("[data-id='" + commentID + "']");
        removedComment.remove();
        
        // delete the selected comment from the API based on the id stored in the data-id attribute
        axios.delete(`${apiURL}/${commentID}?api_key=${apiKey}`)
        .catch(err => console.log(err));
    });

    commentDetails.appendChild(commentBottom);

    // div containing avatar and comment details
    let comment = document.createElement('div');
    comment.classList.add("comment");
    comment.setAttribute('data-id', newComment.id);
    comment.appendChild(commentAvatar);
    comment.appendChild(commentDetails);

    //Once the comment is built add it to the comment list
    let commentsList = document.querySelector('.comments__list');
    commentsList.prepend(comment);
}

/*=================================================== END OF FUNCTION DECLARATIONS =============================================================================*/

//display data from the api when page is loaded

// set the images to be used upon refresh - not ideal but there is no way to post an image to the API for reuse upon refresh
let avatarPrefix = "http://127.0.0.1:5501/sprint-3/assets/images/";
let avatarImages = [`url(${avatarPrefix}michael-avatar.jpg)`,`url(${avatarPrefix}gary-avatar.jpg)`,`url(${avatarPrefix}theo-avatar.jpg)`, `url(${avatarPrefix}avatar.jpg)`];

axios.get(getPath)
.then(res =>{
    // the first three comments retrieved from the API are newest to oldest so they need to be reversed to accomodate new data added to the end of the api
    // split the three off, reverse their order, and put the array back together
    firstThree = res.data.splice(0,3);
    flippedArray = firstThree.reverse();
    commentsArray = firstThree.concat(res.data);
    
    //loop through each object in the comments array - build the html element and display it
    commentsArray.forEach((comment,index) =>{
        // add the Comment protoype to the API object to allow for background images
        comment.__proto__= new Comment();
        
        // if the apiData is one of the default comments then use one of my chosen avatars otherwise use the default one provided with the project
        index <=2 ? comment.setAvatar(avatarImages[index]) : comment.setAvatar(avatarImages[3]);
        
        //construct and build comment
        displayComment(comment);
    });
})
.catch(err => console.log(err));

let commentForm = document.querySelector('.new-comment__form');
// submit the form values using an event listener
commentForm.addEventListener('submit', event=>{
    // prevents the page from reloading upon submit
    event.preventDefault();
    
    // post the new comment to the API
    axios.post(postPath,{
        name:event.target.name.value,
        comment:event.target.message.value
    })
    .then(res =>{
        // once the post has been added to the API then get the new comments array and display it
       
        //get the background image of the avatar associated with the new post
        let commentAvatar = document.querySelector('.new-comment__avatar');
        
        //need to used window.computedStyle to get css styles - .style only returns inline styling
        let computedStyles = window.getComputedStyle(commentAvatar);
        
        //add the Comment prototype to the API object
        res.data.__proto__= new Comment();
        
        //add an avatar image to the new Comment
        res.data.setAvatar(computedStyles.getPropertyValue('background-image'));
        
        // display the new comment
        displayComment(res.data);
     })
    .catch(err => console.log(err));    

    // Reset the input boxes with a blank value and the placeholder
    event.target.name.value="";
    event.target.message.value="";
    
});
