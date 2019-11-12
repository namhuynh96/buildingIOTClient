import React from "react";
import { reduxForm, Field, FieldArray } from "redux-form";
import validate from "./formValidate/validate";

import renderField from "./renderField";
import Button from "../../components/UI/Button/Button";

const renderDevices = ({ fields, meta: { error, submitFailed } }) => {
  return (
    <ul>
      <li>
        <button type="button" onClick={() => fields.push()}>
          Add Device
        </button>
        {submitFailed && error && <span>{error}</span>}
      </li>
      {fields.map((device, index) => (
        <li key={index}>
          <button
            type="button"
            title="Remove Device"
            onClick={() => fields.remove(index)}
          />
          <Field
            name={`${device}.name`}
            type="text"
            component={renderField}
            label={`Device #${index + 1}`}
          />
          <div>
            <label>
              <Field
                name={`${device}.type`}
                type="radio"
                value="digital"
                component={renderField}
              />
              Digital
            </label>
            <label>
              <Field
                name={`${device}.type`}
                type="radio"
                value="analog"
                component={renderField}
              />
              Analog
            </label>
          </div>
        </li>
      ))}
    </ul>
  );
};

const renderRooms = ({ fields, meta: { error, submitFailed } }) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push()}>
        Add Room
      </button>
      {submitFailed && error && <span>{error}</span>}
    </li>
    {fields.map((room, index) => (
      <li key={index}>
        <button
          type="button"
          title="Remove Room"
          onClick={() => fields.remove(index)}
        />
        <Field
          name={`${room}.name`}
          type="text"
          component={renderField}
          label={`Room #${index + 1}`}
        />
        <FieldArray name={`${room}.devices`} component={renderDevices} />
      </li>
    ))}
  </ul>
);

const BuildingForm = props => {
  const buildCancel = () => {
    props.history.push("/");
  };

  return (
    <div>
      <form onSubmit={props.handleSubmit(props.onSubmit)}>
        <Field
          name="buildingName"
          type="text"
          component={renderField}
          label="Name of Building"
        />
        <FieldArray name="rooms" component={renderRooms} />
        <Button buttonType="Danger" clicked={buildCancel} type="button">
          Cancel
        </Button>
        <Button buttonType="Success" type="submit">
          Next
        </Button>
      </form>
    </div>
  );
};

export default reduxForm({
  form: "buildingForm",
  validate,
  destroyOnUnmount: false
})(BuildingForm);
