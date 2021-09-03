import { Field, Form, Formik, FormikProps } from 'formik';
import MapFormField from './MapFormField'
import Button from '@material-ui/core/Button'
import {Select, TextField} from 'formik-material-ui'
import { MenuItem } from '@material-ui/core';
import './ExampleForm.css'

const ExampleForm = () => (

  <div id="myformcontainer">
    <h1>My Form</h1>
    <Formik
      initialValues={{ email: '', color: 'red', firstName: '', lastName: '' }}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }, 1000);
      }}
    >
      {(props: FormikProps<any>) => (
        <Form>
          <Field type="email" name="email" placeholder="Email" />
          <Field component={Select} name="color">
            <MenuItem value="red">Red</MenuItem>
            <MenuItem value="green">Green</MenuItem>
            <MenuItem value="blue">Blue</MenuItem>
          </Field>

          <Field name="firstName">
            {({
              field, // { name, value, onChange, onBlur }
              form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
              meta,
            }:any) => (
              <div>
                <Field component={TextField} placeholder="Something" {...field} />
                {meta.touched && meta.error && (
                  <div className="error">{meta.error}</div>
                )}
              </div>
            )}

          </Field>

          <Field name="lastName" placeholder="Doe" component={MapFormField} />
          <Button variant='contained' color='primary' type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  </div>
);

export default ExampleForm;