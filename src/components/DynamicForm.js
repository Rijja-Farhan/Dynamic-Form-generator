import React, { useState } from 'react';
import * as Yup from 'yup';

const DynamicForm = ({ schema, onSubmit }) => {
  // State to store form values
  const [formValues, setFormValues] = useState(
    schema.reduce((acc, field) => {
      acc[field.name] = field.value || '';
      return acc;
    }, {})
  );

  // Handle field value change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationSchema = Yup.object(
      schema.reduce((acc, field) => {
        const fieldValidation = field.validation || Yup.string().required('This field is required');
        acc[field.name] = fieldValidation;
        return acc;
      }, {})
    );

    try {
      await validationSchema.validate(formValues, { abortEarly: false });
      onSubmit(formValues);
    } catch (err) {
      console.error('Validation error:', err);
    }
  };

  // Render fields dynamically based on schema
  return (
    <form onSubmit={handleSubmit}>
      {schema.map((field) => (
        <div key={field.name} className="form-field">
          <label htmlFor={field.name}>{field.label}</label>
          {field.type === 'text' && (
            <input
              type="text"
              name={field.name}
              value={formValues[field.name]}
              onChange={handleChange}
            />
          )}
          {field.type === 'checkbox' && (
            <input
              type="checkbox"
              name={field.name}
              checked={formValues[field.name]}
              onChange={(e) => handleChange({ target: { name: field.name, value: e.target.checked } })}
            />
          )}
          {field.type === 'select' && (
            <select
              name={field.name}
              value={formValues[field.name]}
              onChange={handleChange}
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {field.type === 'date' && (
            <input
              type="date"
              name={field.name}
              value={formValues[field.name]}
              onChange={handleChange}
            />
          )}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default DynamicForm;
