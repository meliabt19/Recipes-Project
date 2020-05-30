$(document).ready(function() {

  const url = window.location;
  let urlString = url.toString();
  urlString = urlString.replace('http://', '');

  console.log(urlString);

  let step = getStep(urlString);
  step = parseInt(step);

  const id = getId(urlString);

  console.log('step: ', step);
  console.log('id: ', id);

  $('#step').text(step);

  let storedRecipe = window.localStorage.getItem(id);
  storedRecipe = JSON.parse(storedRecipe);

  const currentStepDetails = storedRecipe.find(({number}) => number === step);
  console.log('currentStepDetails', currentStepDetails);

  const lastStep = checkForLastStep(step, storedRecipe);

  if (lastStep === true) {
    $('#next-step').text('Done');
  }

  $('#next-step').on('click', function() {

    event.preventDefault();

    let storedRecipe = window.localStorage.getItem(id);
    storedRecipe = JSON.parse(storedRecipe);

    const nextStep = (step + 1);

    const nextStepDetails = storedRecipe.find(({number}) => number === nextStep);

    console.log('nextStepDetails', nextStepDetails);

    if (nextStepDetails !== undefined) {
      console.log('Next step exists');

      //go to next step
      $.get(`/${id}/steps/:steps`).then(() => {

        window.location.replace(`/${id}/steps/${nextStep}`);
        // If there's an error, log the error
      }).catch(handleStepsErr);

    } else {
      // Finished recipe steps
      window.localStorage.clear();
      window.location.replace('/members');
    }
  });

  $('#previous-step').on('click', function() {

    let storedRecipe = window.localStorage.getItem(id);
    storedRecipe = JSON.parse(storedRecipe);

    console.log('current step: ', step);
    const previousStep = (step - 1);
    console.log('previous step: ', previousStep);

    const previousStepDetails = storedRecipe.find(({number}) => number === previousStep);

    console.log('previousStepDetails', previousStepDetails);

    if (previousStepDetails !== undefined) {
      console.log('Previous step exists');

      //go to previous step
      $.get(`/${id}/steps/:steps`).then(() => {

        window.location.replace(`/${id}/steps/${previousStep}`);
        // If there's an error, log the error
      }).catch(handleStepsErr);

    } else {
      window.location.replace(`/details/${id}`);
    }
  });

});

const checkForLastStep = (step, storedRecipe) => {

  const lastStep = (storedRecipe.length);
  console.log('last step: ', lastStep);
  console.log('current step: ', step);

  //last step cook
  if (step === lastStep) {
    return true;
  }

  return false;
};

const handleStepsErr = err => {
  console.log(err);
};

const getStep = urlString => {
  const stepIndex = urlString.lastIndexOf('/');
  const step = urlString.substring(stepIndex + 1);
  return step;
};

const getId = urlString => {
  const idStartIndex = urlString.indexOf('/');
  const idEndIndex = urlString.indexOf('/steps');
  const id = urlString.substring(idStartIndex + 1, idEndIndex);
  return id;
};