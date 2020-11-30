import React from 'react';

const useForm = (callback, initialState = {}) => {
  const [values, setValues] = React.useState(initialState);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    callback();
  };

  const registerAvatar = (imageUrl) => {
    setValues({ ...values, imageUrl });
  };

  return {
    onChange,
    registerAvatar,
    onSubmit,
    values,
  };
};

export default useForm;
