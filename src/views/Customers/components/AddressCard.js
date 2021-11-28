import { Typography, Card, CardContent } from "@material-ui/core";

const AddressCard = ({
  title = "",
  name = "",
  region = "",
  city = "",
  point = "",
  address1 = "",
  phone = "",
  email = "",
  address2 = "empty",
}) => {
  return (
    <Card style={{margin: 10}}>
      <CardContent>
        <Typography variant="h5" component="h2" color="secondary">
          {title.toUpperCase()}
        </Typography>
        <Typography variant="h5" component="h6" color="primary">
          Name: {name}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          REGION: 
          {region.name}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          CITY: 
          {city.name}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          POINT: 
          {point.name}
        </Typography>
        <Typography color="textSecondary">ADDRESS1: {address1}</Typography>
        <Typography color="textSecondary">PHONE: {phone}</Typography>
        <Typography color="textSecondary">EMAIL: {email}</Typography>
        <Typography variant="body2" component="p">
          ADDRESS2: {address2}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AddressCard;
