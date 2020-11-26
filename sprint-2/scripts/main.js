
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

// var commentsList = document.createElement('div');
// commentsList.classList.add('.comments__list');

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
    commentTime.innerText = newComment.timeStamp;

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

    // new Date(year, month, day, hours, minutes, seconds, milliseconds)
    let today = new Date();
    formattedDate =  (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
    
    // create a new comment object from the values submitted
    let newComment = {
        name:event.target.name.value,
        timeStamp:formattedDate,
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

