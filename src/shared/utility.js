export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

export const checkValidity = (value, array, rules) => {
  let errorMessage = null;
  if (!rules) {
    return null;
  }

  if (rules.required) {
    errorMessage = value === "" ? "Required" : errorMessage;
  }

  if (rules.checkAWSIotPattern) {
    const awsIotThingPattern = /^[a-zA-Z\d-_:]+$/;
    if (value.length) {
      errorMessage = !awsIotThingPattern.test(value)
        ? "Must contain only alphanumeric characters and/or the following: -_:"
        : errorMessage;
    }
  }

  if (rules.checkDuplicatedElementsInArray) {
    const duplicatedElement = array.find((element, index) => {
      const rest = array.slice(index + 1);
      return rest.includes(element);
    });
    errorMessage = duplicatedElement ? "The name is taken" : errorMessage;
  }

  return errorMessage;
};

export const formatTime = timeInSecond => {
  const time = new Date(timeInSecond * 1000);

  const date = time.getDate();
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    time
  );
  const hours = time.getHours();
  const minutes = "0" + time.getMinutes();
  const seconds = "0" + time.getSeconds();

  const formattedTime =
    month +
    " " +
    date +
    " at " +
    hours +
    ":" +
    minutes.substring(minutes.length - 2) +
    ":" +
    seconds.substring(seconds.length - 2);

  return formattedTime;
};
