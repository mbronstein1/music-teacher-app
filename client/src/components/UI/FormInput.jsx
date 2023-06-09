import React, { forwardRef } from 'react';

const FormInput = forwardRef(({ id, type, label, subText, required, onChange, accept }, ref) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input onChange={onChange} type={type} name={id} id={id} required={required} ref={ref} accept={accept} />
      {subText && (
        <div style={{ textAlign: 'end' }}>
          <sub>{subText}</sub>
        </div>
      )}
    </div>
  );
});

export default FormInput;
