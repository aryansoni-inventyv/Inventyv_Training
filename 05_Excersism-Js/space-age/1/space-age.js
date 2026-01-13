//
// This is only a SKELETON file for the 'Space Age' exercise. It's been provided as a
// convenience to get you started writing code faster.
//

export const age = (Planet , seconds) => {
  const earth_period =  365.25;
  let ans =  seconds / (earth_period * 24 * 3600) ;

  if(Planet == 'earth'){
    return parseFloat((ans).toFixed(2)) ;
  }
  else if(Planet == 'mercury'){
    return parseFloat((ans / 0.2408467).toFixed(2)) ;
  }
  else if(Planet == 'venus'){
    return parseFloat((ans / 0.61519726).toFixed(2)) ;
  }
  else if(Planet == 'mars'){
    return parseFloat((ans / 1.8808158).toFixed(2)) ;
  }
  else if(Planet == 'jupiter'){
    return parseFloat((ans / 11.862615).toFixed(2) );
  }
  else if(Planet == 'saturn'){
    return parseFloat((ans / 29.447498).toFixed(2))  ;
  }
  else if(Planet == 'uranus'){
    return parseFloat((ans / 84.016846).toFixed(2));
  }
  else if (Planet == 'neptune'){
    return parseFloat((ans / 164.79132).toFixed(2)) ;
  }else{
    throw new Error ('not a planet') ;
  }
  
  
};
