let labels=['DATE', 'VENUE', 'LOCATION'];

let shows = [
    {   
        date:'Mon Dec 17 2018',
        venue:'Ronald Lane',
        location: 'San Francisco, CA'
    },
    {   
        date:'Tue Jul 18 2019',
        venue:'Pier 3 East',
        location: 'San Francisco, CA'
    },
    {   
        date:'Fri Jul 22 2019',
        venue:'View Lounge',
        location: 'San Francisco, CA'
    },
    {   
        date:'Sat Aug 12 2019',
        venue:'Hyatt Agency',
        location: 'San Francisco, CA'
    },
    {   
        date:'Fri Sep 05 2019',
        venue:'Moscow Center',
        location: 'San Francisco, CA'
    },
    {   
        date:'Wed Aug 11 2019',
        venue:'Pres Club',
        location: 'San Francisco, CA'
    }
];

//Get the container on the page that the shows will be appended to
let showsList = document.querySelector('.shows__list');

let showsTabletLabels = document.createElement('ul');
showsTabletLabels.classList.add('shows__labels-tablet');

labels.forEach(label=>{
    let tabletLabel = document.createElement('li');
    tabletLabel.classList.add('shows__label');
    tabletLabel.innerText = label;
    showsTabletLabels.appendChild(tabletLabel);
});

showsList.appendChild(showsTabletLabels);

//create the labels outside of function because they don't change 
let showLabels = [];
labels.forEach(label=>{
    let showLabel = document.createElement('li');
    showLabel.classList.add('show__label--mobile');
    showLabel.innerText = label;
    showLabels.push(showLabel);
});


const displayShow = show =>{

    let showContainer = document.createElement('div');
    showContainer.classList.add("show");

    let showDetails = document.createElement('ul');
    showDetails.classList.add("show__details");

    let showDate = document.createElement('li');
    showDate.classList.add('show__date')
    showDate.innerText = show.date;
    
    let showVenue = document.createElement('li');
    showVenue.classList.add('show__venue')
    showVenue.innerText = show.venue;
    
    let showLocation = document.createElement('li'); 
    showLocation.classList.add('show__location')
    showLocation.innerText = show.location;

    let showButton = document.createElement('button');
    showButton.classList.add('show__cta');
    showButton.innerText = "BUY TICKETS";

    showDetails.appendChild(showLabels[0]);
    showDetails.appendChild(showDate);
    showDetails.appendChild(showLabels[1]);
    showDetails.appendChild(showVenue);
    showDetails.appendChild(showLabels[2]);
    showDetails.appendChild(showLocation);

    showContainer.appendChild(showDetails);
    showContainer.appendChild(showButton);

    showsList.appendChild(showContainer);    
}

shows.forEach(show=>{
    displayShow(show);
})