import { makeStyles } from "@material-ui/core";

const selectStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 50,
    padding: 10,
    fontSize:'1.2rem',
    borderRadius: 8,
    borderColor: 'rgba(0, 0, 0, .3)',
    color: 'rgba(0, 0, 0, .6)',
    outline: 'none',
    marginBottom: 10
  },
}));

const CustomSelect = ({
  data = [],
  name = "",
  title = "",
  value = null,
  onChange,
}) => {
  const classes = selectStyles();
  
  return (
    <select className={classes.root} name={name} value={value} onChange={onChange}>
      {title}
      <option value="">{name}</option>
      {data.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
};

export default CustomSelect;
