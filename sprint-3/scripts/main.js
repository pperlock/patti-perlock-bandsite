// Start by retrieve the comments the api and load them them to the screen when page opens

let apiURL = "https://project-1-api.herokuapp.com/comments";
apiKey = "ff3a12db-f14e-431c-a352-c5da9393f05b";

axios.get(`${apiURL}?api_key=${apiKey}`)
.then(res =>{
    //console.log(res);
    /* loop through each object in the comments array - build the html element and display it*/
    res.data.forEach(comment =>{
        displayComment(comment);
    });
})
.catch(err => console.log(err));

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

    deleteBtn = document.createElement('button');
    deleteBtn.classList.add("comment__delete");
    deleteBtn.innerText = "x";
    // console.log(deleteBtn);
    document.createAttribute('data-id');
    deleteBtn.setAttribute('data-id', newComment.id);
    commentDetails.appendChild(deleteBtn);
    // console.log(deleteBtn.getAttribute("data-id"));

    deleteBtn.addEventListener('click', event=>{
        let commentID = event.target.getAttribute('data-id');
        axios.delete(`${apiURL}/${commentID}?api_key=${apiKey}`)
        .then(res=>{
            axios.get(`${apiURL}?api_key=${apiKey}`)
            .then(res =>{
                console.log(res);
                //clear all the previous comments from the screen
                const allComments = document.querySelectorAll('.comment');
                allComments.forEach(comment=>{
                    comment.remove();
                });
                /* loop through each object in the comments array - build the html element and display it*/
                res.data.forEach(comment =>{
                    displayComment(comment);
                });
            })
            .catch(err => console.log(err));
        })    
        .catch(err => console.log(err));
    });

    // div containing avatar and comment details
    let comment = document.createElement('div');
    comment.classList.add("comment");
    comment.appendChild(commentAvatar);
    comment.appendChild(commentDetails);

    //Once the comment is built add it to the comment list
    let commentsList = document.querySelector('.comments__list');
    commentsList.prepend(comment);
}

//console.log(`${apiURL}/8d3aea60-8f97-4772-aa9f-93179bcc3659?api_key=${apiKey}`)

// //CLEAN OUT THE POSTS TO START WITH DEFAULT
// axios.get(`${apiURL}?api_key=${apiKey}`)
// .then(res =>{
//     for (let i=3; i<res.data.length;i++){
//         axios.delete(`${apiURL}/${res.data[i].id}?api_key=${apiKey}`)
//         .then(res =>{
//             console.log(res);
//         })
//     }
// })
// .catch(err => console.log(err));


let commentForm = document.querySelector('.new-comment__form');
// submit the form values using an event listener
commentForm.addEventListener('submit', event=>{
    // prevents the page from reloading upon submit
    event.preventDefault();

    //clear all the previous comments from the screen
    const allComments = document.querySelectorAll('.comment');
    allComments.forEach(comment=>{
        comment.remove();
    });

    // post the new comment to the API
    axios.post(`${apiURL}?api_key=${apiKey}`,{
        name:event.target.name.value,
        comment:event.target.message.value
    })
    .then(res =>{
        // once the post has been added then get the comments array and display it
        axios.get(`${apiURL}?api_key=${apiKey}`)
        .then(res =>{
            /* loop through each object in the comments array - build the html element and display it*/
            res.data.forEach(comment =>{
                displayComment(comment);
            });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));    

    // Reset the input boxes with a blank value and the placeholder
    event.target.name.value="";
    event.target.message.value="";
    
});

// let deleteBtns = document.querySelectorAll('.comment__details');
// // submit the form values using an event listener
// console.log(deleteBtns);

// deleteBtns.forEach(deleteBtn =>{
//     deleteBtn.addEventListener('click', event=>{
//         console.log(event.target);
//     });
// });