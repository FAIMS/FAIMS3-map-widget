import { Field, Form, Formik, FormikProps } from 'formik';
import MapFormField from './MapFormField'
import Button from '@material-ui/core/Button'
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

          <Field name="circle" featureType="Circle" component={MapFormField} />

          <Field name="point" featureType="Point" component={MapFormField} />

          <Field name="polygon" featureType="Polygon" component={MapFormField} />

          <Field name="linestring" featureType="LineString" component={MapFormField} />

          <Button variant='contained' color='primary' type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  </div>
);

export default ExampleForm;