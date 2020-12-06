// initialize an array to hold each labels for each show detail
let labels = ['DATE', 'VENUE', 'LOCATION'];

// initialize an array to hold the classes for each show detail
let classes = ['show__date', 'show__venue','show__location'];

//Get the container on the page that a show will be appended to
let showsList = document.querySelector('.shows__list');

// create the tablet labels that show on devices >= tablet size
let showsTabletLabels = document.createElement('ul');
showsTabletLabels.classList.add('shows__labels-tablet');

labels.forEach(label=>{
    let tabletLabel = document.createElement('li');
    tabletLabel.classList.add('shows__label');
   if(label=='DATE'){
        tabletLabel.innerText = label + "S";
    }else{
        tabletLabel.innerText = label;
    }
    showsTabletLabels.appendChild(tabletLabel);
});

// add the tablet labels to the shows list container
showsList.appendChild(showsTabletLabels);

/**
 * Function displayShow
 * Useage: Takes in a show object, builds the html structure and displays it
 * @param {show Object} show 
 */
const displayShow = show =>{
    // create a container for the show
    let showContainer = document.createElement('div');
    showContainer.classList.add("show");
   
    // create a list for the show details
    let showDetails = document.createElement('ul');
    showDetails.classList.add("show__details");
    
    // create the list elements for the show details
    let key='';
    labelCounter=0;
    keyCounter=0;
    // loop through each object key*2 for labels
    for(let i=0; i < Object.keys(show).length*2; i++){
        //create a list element 
        showElement = document.createElement('li');
        // if it is an even number element make it a label
        if (i%2==0){
            showElement.classList.add("show__label--mobile");
            showElement.innerText = (labels[labelCounter]);
            labelCounter++;
        // if it is an odd number element make it the value of the key associated with that label
        }else{
            key = Object.keys(show)[keyCounter];
            showElement.classList.add(classes[keyCounter]);
            key==="date" ? showElement.innerText = new Date(show[key]).toDateString() : showElement.innerText = show[key];
            keyCounter++;
        }
        // append the new element to the details list
        showDetails.appendChild(showElement);
    };

    // append the details element to the show container
    showContainer.appendChild(showDetails);
    
    // create a button for the 
    let showButton = document.createElement('button');
    showButton.classList.add('show__cta');
    showButton.innerText = "BUY TICKETS";

    // append the button to the show container
    showContainer.appendChild(showButton); 
    
    // append the show to the show list
    showsList.appendChild(showContainer);
};

// url and key for the API
let apiURL = "https://project-1-api.herokuapp.com/showdates";
apiKey = "ff3a12db-f14e-431c-a352-c5da9393f05b";

// get the shows data from the api
axios.get(`${apiURL}?api_key=${apiKey}`)
.then(res =>{
    let shows  = res.data;
    //remove the id key from the shows objects to accomodate the loops used above
    shows.forEach(show=> delete show.id);

    // Display the entire shows array     
    shows.forEach((show)=>{
        displayShow(show);
    });
})
.catch(err => console.log(err));
