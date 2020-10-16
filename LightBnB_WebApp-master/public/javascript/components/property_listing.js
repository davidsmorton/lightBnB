$(() => {
  window.propertyListing = {};
  
  function createListing(property, isReservation) {
    return `
    <article class="property-listing">
        <section class="property-listing__preview-image">
          <img src="${property.thumbnail_photo_url}" alt="house">
        </section>
        <section class="property-listing__details">
          <h3 class="property-listing__title">${property.title}</h3>
          <ul class="property-listing__details">
            <li>number_of_bedrooms: ${property.number_of_bedrooms}</li>
            <li>number_of_bathrooms: ${property.number_of_bathrooms}</li>
            <li>parking_spaces: ${property.parking_spaces}</li>
          </ul>
          ${isReservation ? 
            `<p>${moment(property.start_date).format('ll')} - ${moment(property.end_date).format('ll')}</p>` 
            : ``}

            ${!isReservation ?  
            `<form action="/api/reservations" method="post" id="reservation-form" class="reservation-form">
            <label for="start">Start date:</label>

            <input type="date" id="start" name="start_date" 
                   value="2018-07-22"
                   min="2018-01-01" max="2021-12-31">
          
            <label for="end">End date:</label>

            <input type="date" id="end" name="end_date" 
                  value="2018-07-22"
                  min="2018-01-01" max="2021-12-31">
            <input hidden name="property_id" value = ${property.id}>
            
            <button id="submit-reservation" type="submit">Submit</button>
                  
          </form> ` :``}   

          <footer class="property-listing__footer">
            <div class="property-listing__rating">${Math.round(property.average_rating * 100) / 100}/5 stars</div>
            <div class="property-listing__price">$${property.cost_per_night/100.0}/night</div>

            
          </footer>
        </section>
      </article>
    `
  }

  window.propertyListing.createListing = createListing;

});