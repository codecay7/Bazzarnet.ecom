import { useState, useCallback } from 'react';

/**
 * A custom hook for handling form validation.
 * It manages validation errors and provides a function to trigger validation.
 *
 * @param {object} initialData - The initial form data object.
 * @param {function} validateFunction - A function that takes the form data and returns an errors object.
 * @returns {{errors: object, validate: function, resetErrors: function}} - An object containing errors, a validate function, and a resetErrors function.
 */
const useFormValidation = (initialData, validateFunction) => {
  const [errors, setErrors] = useState({});

  const validate = useCallback((data) => {
    const newErrors = validateFunction(data);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateFunction]);

  const resetErrors = useCallback(() => {
    setErrors({});
  }, []);

  return { errors, validate, resetErrors };
};

export default useFormValidation;